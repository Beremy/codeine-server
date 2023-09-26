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
      error_aggregation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "error_aggregations",
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
