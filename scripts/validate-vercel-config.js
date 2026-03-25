const fs = require('fs');

const raw = fs.readFileSync('vercel.json', 'utf8');
const config = JSON.parse(raw);

if (!Array.isArray(config.builds) || !config.builds.length) {
  console.error('Invalid vercel.json: top-level "builds" is required for stable Node deployment.');
  process.exit(1);
}

const nodeBuild = config.builds.find(
  (build) => build.src === 'api/index.js' && build.use === '@vercel/node'
);

if (!nodeBuild) {
  console.error('Invalid vercel.json: missing @vercel/node build for api/index.js.');
  process.exit(1);
}

const includeFiles = nodeBuild.config?.includeFiles;
if (!includeFiles || typeof includeFiles !== 'string') {
  console.error('Invalid vercel.json: builds[].config.includeFiles must be a string.');
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
