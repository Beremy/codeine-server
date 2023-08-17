const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TestSpecification extends Model {}

  TestSpecification.init(
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
      type: {
        type: DataTypes.ENUM,
        values: ['hypothesis', 'condition', 'negation'],
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      word_positions: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "test_specifications",
      timestamps: false,
    }
  );

  return TestSpecification;
};
