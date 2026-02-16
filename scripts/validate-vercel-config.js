const fs = require('fs');

const raw = fs.readFileSync('vercel.json', 'utf8');
const config = JSON.parse(raw);

if (Object.prototype.hasOwnProperty.call(config, 'builds')) {
  console.error('Invalid vercel.json: top-level "builds" must not be present.');
  process.exit(1);
}

if (!config.functions || !config.functions['api/index.js']) {
  console.error('Invalid vercel.json: functions["api/index.js"] is required.');
  process.exit(1);
}

if (!Array.isArray(config.routes) || !config.routes.length) {
  console.error('Invalid vercel.json: at least one route is required.');
  process.exit(1);
}

const catchAll = config.routes.some((route) => route.src === '/(.*)' && route.dest === 'api/index.js');
if (!catchAll) {
  console.error('Invalid vercel.json: missing catch-all route to api/index.js.');
  process.exit(1);
}

console.log('vercel.json validation passed.');
