require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    timezone: "+02:00",
    define: {
      timestamps: false,
      freezeTableName: true,
    },
  }
);

const connectToDb = async () => {
  console.log("connectToDb");
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to our db");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sequelize, connectToDb };
