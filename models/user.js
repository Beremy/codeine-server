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
        allowNull: true,
      },
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      monthly_points: {
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
      catch_probability: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      consecutiveDaysPlayed: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      lastPlayedDate: {
        type: DataTypes.STRING(45),
        unique: true,
      },
      created_at: {
        type: DataTypes.STRING(45),
      },
      coeffMulti: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0,
      },
      nb_first_monthly: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      tutorial_progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      message_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
