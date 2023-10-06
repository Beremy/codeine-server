const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["inconnu", "medecin", "autre"],
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        defaultValue: "",
      },
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      trust_index: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      notifications_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["homme", "femme"],
        allowNull: false,
        defaultValue: "homme",
      },
      color_skin: {
        type: DataTypes.ENUM,
        values: ["clear", "medium", "dark"],
        allowNull: false,
      },
      moderator: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "users",
      timestamps: false,
    }
  );

  return User;
};
