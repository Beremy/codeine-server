const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Text extends Model {
    static associate(models) {
      this.belongsTo(models.Theme, { foreignKey: "id_theme" });
    }
  }
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
        defaultValue: "",
      },
      id_theme: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      plausibility: {
        type: DataTypes.DECIMAL(50, 0),
        allowNull: true,
        defaultValue: 0,
      },
      origin: {
        type: DataTypes.STRING(45),
        allowNull: true,
        defaultValue: "generated",
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
