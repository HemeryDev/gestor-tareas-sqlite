const path = require("path");

const PORT = Number(process.env.PORT || 4000);
const DB_JSON_PATH =
  process.env.DB_JSON_PATH ||
  path.join(__dirname, "..", "db.json");

module.exports = { PORT, DB_JSON_PATH };

