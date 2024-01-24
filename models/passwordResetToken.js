const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PasswordResetToken extends Model {}
  PasswordResetToken.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "password_reset_tokens",
      timestamps: false,
    }
  );
  return PasswordResetToken;
};
