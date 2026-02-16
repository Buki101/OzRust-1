const crypto = require('crypto');
const path = require('path');
const express = require('express');
const { getPool } = require('../lib/db');

const app = express();
app.use(express.json());

const AUTH_COOKIE_NAME = 'ozrust_session';
const AUTH_TTL_MS = 1000 * 60 * 60 * 24;
const AUTH_SECRET = process.env.AUTH_SECRET || 'change-this-secret';
const AUTH_USER = process.env.AUTH_USER || 'admin';
const AUTH_PASS = process.env.AUTH_PASS || 'changeme';

const ALLOWED_STATS = new Set([
  'PVPKills',
  'PVEKills',
  'NPCKills',
  'Deaths',
  'HeadShots',
  'KDR',
  'Economics',
  'ServerRewards'
]);

const leaderboardCache = new Map();
const CACHE_TTL_MS = 30_000;

function clampLimit(limitParam) {
  const parsed = Number.parseInt(limitParam, 10);
  if (Number.isNaN(parsed)) return 50;
  return Math.min(200, Math.max(1, parsed));
}

function toLeaderboardRow(stat, row) {
  return {
    userId: row.UserID,
    name: row.Name,
    clan: row.Clan,
    status: row.Status,
    activeDate: row.ActiveDate,
    value: row[stat]
  };
}

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const [key, ...rest] = part.split('=');
      acc[key] = decodeURIComponent(rest.join('='));
      return acc;
    }, {});
}

function signToken(payloadPart) {
  return crypto.createHmac('sha256', AUTH_SECRET).update(payloadPart).digest('base64url');
}

function createSessionToken(username) {
  const payload = Buffer.from(
    JSON.stringify({ username, exp: Date.now() + AUTH_TTL_MS })
  ).toString('base64url');
  return `${payload}.${signToken(payload)}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const [payloadPart, sigPart] = token.split('.');
  if (!payloadPart || !sigPart) return null;

  const expectedSig = signToken(payloadPart);
  const sigBuffer = Buffer.from(sigPart);
  const expectedBuffer = Buffer.from(expectedSig);

  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch (_error) {
    return null;
  }
}

function getSession(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[AUTH_COOKIE_NAME];
  return verifySessionToken(token);
}

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  const secure = isProd ? ' Secure;' : '';
  res.setHeader(
    'Set-Cookie',
    `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400;${secure}`
  );
}

function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;`);
}

function requireAuthApi(req, res, next) {
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Sign in required.' });
  }

  req.session = session;
  return next();
}

function requireAuthPage(req, res, next) {
  const session = getSession(req);
  if (!session) {
    return res.redirect(`/signin?next=${encodeURIComponent(req.originalUrl)}`);
  }

  req.session = session;
  return next();
}

app.post('/api/auth/login', (req, res) => {
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '');

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username !== AUTH_USER || password !== AUTH_PASS) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = createSessionToken(username);
  setAuthCookie(res, token);
  return res.json({ ok: true, username });
});

app.post('/api/auth/logout', (req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

app.get('/api/auth/session', (req, res) => {
  const session = getSession(req);
  return res.json({ signedIn: Boolean(session), username: session?.username || null });
});

app.use(express.static(path.join(__dirname, '..')));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// TODO: add rate limiting middleware if/when the project introduces shared middleware.

app.get('/api/leaderboard', requireAuthApi, async (req, res) => {
  try {
    const stat = req.query.stat || 'PVPKills';
    if (!ALLOWED_STATS.has(stat)) {
      return res.status(400).json({ error: 'Invalid stat value.' });
    }

    const limit = clampLimit(req.query.limit);
    const cacheKey = `${stat}:${limit}`;
    const cached = leaderboardCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return res.json(cached.payload);
    }

    const pool = getPool();

    const kdrFilter = stat === 'KDR' ? 'AND PVPKills >= 20 AND Deaths >= 1' : '';
    const sql = `
      SELECT UserID, Name, Clan, Status, ActiveDate, ${stat}
      FROM playerranksdb
      WHERE (OptOut IS NULL OR OptOut = 0)
        AND Name IS NOT NULL
        ${kdrFilter}
      ORDER BY ${stat} DESC
      LIMIT ?
    `;

    const [rows] = await pool.query(sql, [limit]);

    const payload = {
      stat,
      limit,
      rows: rows.map((row) => toLeaderboardRow(stat, row))
    };

    leaderboardCache.set(cacheKey, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      payload
    });

    return res.json(payload);
  } catch (error) {
    console.error('Leaderboard query failed:', error);
    return res.status(500).json({ error: 'Unable to fetch leaderboard data.' });
  }
});

app.get('/api/player/:steamId', requireAuthApi, async (req, res) => {
  try {
    const { steamId } = req.params;

    if (!/^\d{17}$/.test(steamId)) {
      return res.status(400).json({ error: 'Invalid steamId format. Expected 17 digits.' });
    }

    const pool = getPool();
    const sql = 'SELECT * FROM playerranksdb WHERE UserID = ? LIMIT 1';
    const [rows] = await pool.query(sql, [steamId]);

    if (!rows.length) {
      return res.status(404).json({ error: 'Player not found.' });
    }

    return res.json({ player: rows[0] });
  } catch (error) {
    console.error('Player query failed:', error);
    return res.status(500).json({ error: 'Unable to fetch player.' });
  }
});

app.get('/signin', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'signin.html'));
});

app.get('/leaderboard', requireAuthPage, (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'leaderboard.html'));
});

app.get('/player/:steamId', requireAuthPage, (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'player.html'));
});

app.get('/ozrust', requireAuthPage, (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'ozrust.html'));
});

app.get('/subscription/:kitId', requireAuthPage, (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'subscription.html'));
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Suggested MariaDB indexes for performance:
// CREATE INDEX idx_pvpkills ON playerranksdb (PVPKills DESC);
// CREATE INDEX idx_kdr ON playerranksdb (KDR DESC, PVPKills, Deaths);
// CREATE INDEX idx_active ON playerranksdb (ActiveDate DESC);

module.exports = app;
