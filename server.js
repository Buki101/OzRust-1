const path = require('path');
const express = require('express');
const { getPool } = require('./lib/db');

const app = express();
const port = Number(process.env.PORT || 4173);

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

app.use(express.static(path.join(__dirname)));
app.use('/public', express.static(path.join(__dirname, 'public')));

// TODO: add rate limiting middleware if/when the project introduces shared middleware.

app.get('/api/leaderboard', async (req, res) => {
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

app.get('/api/player/:steamId', async (req, res) => {
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

app.get('/leaderboard', (_req, res) => {
  res.sendFile(path.join(__dirname, 'leaderboard.html'));
});

app.get('/player/:steamId', (_req, res) => {
  res.sendFile(path.join(__dirname, 'player.html'));
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

// Suggested MariaDB indexes for performance:
// CREATE INDEX idx_pvpkills ON playerranksdb (PVPKills DESC);
// CREATE INDEX idx_kdr ON playerranksdb (KDR DESC, PVPKills, Deaths);
// CREATE INDEX idx_active ON playerranksdb (ActiveDate DESC);
