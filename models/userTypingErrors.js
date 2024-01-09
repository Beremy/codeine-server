const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserTypingErrors extends Model {}

  UserTypingErrors.init(
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
      user_error_details_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_error_details",
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
      modelName: "user_typing_errors",
      timestamps: false,
    }
  );

  return UserTypingErrors;
};
