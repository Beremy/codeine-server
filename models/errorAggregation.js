const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ErrorAggregation extends Model {}

  ErrorAggregation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      text_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "texts",
          key: "id",
        },
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      error_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "error_types",
          key: "id",
        },
      },
      word_positions: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_test: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "error_aggregations",
      timestamps: false,
    }
  );

  return ErrorAggregation;
};
