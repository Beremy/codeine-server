require("dotenv").config();
const { Sequelize } = require("sequelize");
const { sequelize } = require("../service/db");

const AchievementModel = require("./achievement.js");
const UserModel = require("./user.js");

const UserAchievement = require("./userAchievement.js")(sequelize, Sequelize.DataTypes);
const Achievement = AchievementModel(sequelize, Sequelize.DataTypes);
const User = UserModel(sequelize, Sequelize.DataTypes);

const models = {
  User: User,  
  Achievement: Achievement,
  UserAchievement: UserAchievement,
};

// Associations UserAchievement
User.hasMany(UserAchievement, {
  foreignKey: "user_id",
  sourceKey: "id",
});
UserAchievement.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
});

Achievement.hasMany(UserAchievement, {
  foreignKey: "achievement_id",
  sourceKey: "id",
});
UserAchievement.belongsTo(Achievement, {
  foreignKey: "achievement_id",
  targetKey: "id",
});


sequelize.sync();

module.exports = models;
