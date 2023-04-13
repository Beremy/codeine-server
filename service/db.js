const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("hostomytho_bdd", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

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