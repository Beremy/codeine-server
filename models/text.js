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
      origin: {
        type: DataTypes.STRING(45),
        allowNull: true,
        defaultValue: "generated",
      },
      is_plausibility_test: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      test_plausibility: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
      },
      avg_weighted_plausibility: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
      },
      is_specification_test: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      nb_of_treatments: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
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
