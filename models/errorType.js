const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ErrorType extends Model {}

  ErrorType.init(
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true, 
      },
    },
    {
      sequelize,
      modelName: "error_types",
      timestamps: false,
    }
  );

  return ErrorType;
};
