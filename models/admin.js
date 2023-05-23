const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {}

  Admin.init(
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
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(45),
        defaultValue: "",
      },
    },
    {
      sequelize,
      modelName: "admins",
      timestamps: false,
    }
  );
  return Admin;
};
