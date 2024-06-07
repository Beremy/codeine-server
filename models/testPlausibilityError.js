const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TestPlausibilityError extends Model {}

  TestPlausibilityError.init(
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
      word_positions: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "test_plausibility_errors",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return TestPlausibilityError;
};
