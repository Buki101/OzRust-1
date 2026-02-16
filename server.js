const app = require('./api');

const port = Number(process.env.PORT || 4173);

app.listen(port, () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
