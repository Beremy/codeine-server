const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserPlayedErrors extends Model {}

  UserPlayedErrors.init(
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
      played_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "user_played_errors",
      timestamps: false,
    }
  );

  return UserPlayedErrors;
};
