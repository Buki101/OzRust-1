# NetherPunch / OzRust Demo Site

This project is a lightweight Node/Express + static frontend site for:
- homepage + server kit pages
- kit detail pages
- leaderboard/player pages backed by MariaDB

---

## 1) Configure PayNow.gg kit checkout links

Kit checkout links are intentionally left blank in:
- `public/js/subscription.js`

Look for the `CHECKOUT_LINKS` object and paste each PayNow.gg product/checkout URL.

Example format:

```js
const CHECKOUT_LINKS = {
  'ozrust-quarry': 'https://paynow.gg/....',
  'ozrust-crocodile': 'https://paynow.gg/....',
  // ...
};
```

### Important behavior
- There is **no cart flow** in this build.
- Each kit has its **own direct checkout URL**.
- If a link is blank, the button will show `Checkout unavailable`.

---

## 2) Configure leaderboard database

The leaderboard API uses MariaDB via `mysql2/promise`.

Set these environment variables:

- `DB_HOST`
- `DB_USER`
- `DB_PASS`
- `DB_NAME` (default expected: `PlayerRanks`)
- `DB_PORT`

Optional auth/session vars used by local sign-in flow:

- `AUTH_USER`
- `AUTH_PASS`
- `AUTH_SECRET`

Reference file: `.env.example`

---

## 3) Leaderboard endpoints

- `GET /api/leaderboard?stat=PVPKills&limit=50`
- `GET /api/player/:steamId`

Notes:
- stat is whitelisted in code
- player lookup validates 17-digit steam ID
- OptOut players are excluded from leaderboard results

---

## 4) Local run

```bash
npm install
npm start
```

Then open:
- `/`
- `/ozrust`
- `/rustygoose`
- `/subscription/<kit-id>`
- `/leaderboard`

---

## 5) Vercel

Project includes `vercel.json` and `api/index.js` entrypoint.

Before deploy, sanity check:

```bash
node scripts/validate-vercel-config.js
```
