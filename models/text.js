const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Text extends Model {}
  Text.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      theme: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      plausibility: {
        type: DataTypes.DECIMAL(50, 0),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "texts",
      timestamps: false,
    }
  );
  return Text;
};
