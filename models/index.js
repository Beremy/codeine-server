require("dotenv").config();
const { Sequelize } = require("sequelize");
const { sequelize } = require("../service/db");

const UserModel = require("./user.js");
const User = UserModel(sequelize, Sequelize.DataTypes);

const models = {
  User: User,
};

sequelize.sync();

module.exports = models;
