const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Achievement extends Model {}

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      picto: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "achievements",
      timestamps: false,
    }
  );

  return Achievement;
};
