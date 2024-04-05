const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserTextRating extends Model {}

  UserTextRating.init(
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
      plausibility: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      sentence_positions: {
        type: DataTypes.STRING,
      },
      vote_weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "user_text_rating",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return UserTextRating;
};
