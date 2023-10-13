const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Criminal extends Model {}

  Criminal.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "criminals",
      timestamps: false,
    }
  );

  return Criminal;
};
