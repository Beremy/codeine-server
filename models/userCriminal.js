const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserCriminal extends Model {}

  UserCriminal.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      criminal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "criminals",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "user_criminals",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return UserCriminal;
};
