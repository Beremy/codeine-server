const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserTypingResponses extends Model {}

  UserTypingResponses.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      error_aggregation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "error_aggregations",
          key: "id",
        },
      },
      error_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "error_types",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "user_typing_responses",
      timestamps: false,
    }
  );

  return UserTypingResponses;
};
