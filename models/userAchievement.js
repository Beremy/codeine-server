const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserAchievement extends Model {}

  UserAchievement.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      achievement_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "achievements",
          key: "id",
        },
      },
      notifications_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "user_achievement",
      timestamps: false,
    }
  );

  return UserAchievement;
};
