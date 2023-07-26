const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class userSkin extends Model {}

  userSkin.init(
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
      skin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "skins",
          key: "id",
        },
      },
      equipped: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "user_skin",
      timestamps: false,
    }
  );

  return userSkin;
};
