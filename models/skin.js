const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Skin extends Model {}

  Skin.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM,
        values: ["veste", "chapeau", "lunettes", "visage", "pilosité"],
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["homme", "femme", "unisexe"],
        allowNull: false,
      },
      rarity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "skins",
      timestamps: false,
    }
  );

  return Skin;
};
