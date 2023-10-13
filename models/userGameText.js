const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserGameText extends Model {}

  UserGameText.init(
    {
      id: {
        type: DataTypes.INTEGER,
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
      text_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "texts",
          key: "id",
        },
      },
      game_type: {
        type: DataTypes.ENUM,
        values: ['hypothesis', 'condition', 'negation', 'plausibility', 'temporal_entity', 'link_entity'],
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "user_game_texts",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false, 
    }
  );

  return UserGameText;
};
