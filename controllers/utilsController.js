const { sequelize } = require("../service/db.js");
const fs = require("fs");
const path = require("path");

const dumpTables = async (req, res) => {
  const { tables } = req.body;
  const date = new Date();
  const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const filename = `tables_dump_${dateString}.json`;
  const filePath = path.resolve(__dirname, `../dumps/${filename}`);
  const dumps = {};

  try {
    for (const table of tables) {
      const data = await sequelize.models[table].findAll();
      dumps[table] = data;
    }

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(dumps, null, 2), "utf8");

    res.download(filePath, filename, (err) => {
      if (!err) {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      }
    });
  } catch (error) {
    console.error("Erreur d'autorisation:", error);
    res.status(500).send("Erreur d'autorisation");
  }
};


module.exports = { dumpTables };
