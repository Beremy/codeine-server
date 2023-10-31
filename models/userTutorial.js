const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserTutorial extends Model {}

  UserTutorial.init(
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
      game_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "games",
          key: "id",
        },
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "user_tutorials",
      timestamps: false,
    }
  );

  return UserTutorial;
};
