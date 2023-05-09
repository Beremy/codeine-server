require("dotenv").config();
const { Sequelize } = require("sequelize");
const { sequelize } = require("../service/db");

const AchievementModel = require("./achievement.js");
const UserModel = require("./user.js");
const Achievement = AchievementModel(sequelize, Sequelize.DataTypes);
const User = UserModel(sequelize, Sequelize.DataTypes);

const models = {
  User: User,  
  Achievement: Achievement,
};

sequelize.sync();

module.exports = models;
