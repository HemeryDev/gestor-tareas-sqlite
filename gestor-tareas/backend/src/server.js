const { PORT, DB_JSON_PATH } = require("./config");
const { ensureDbFile } = require("./db/jsonDb");
const { createApp } = require("./app");

async function main() {
  await ensureDbFile(DB_JSON_PATH);
  const app = createApp({ dbPath: DB_JSON_PATH });

  app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
  });
}

if (process.env.VERCEL) {
  module.exports = async (req, res) => {
    await ensureDbFile(DB_JSON_PATH);
    const app = createApp({ dbPath: DB_JSON_PATH });
    return app(req, res);
  };
} else {
  // inic servid
  main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
