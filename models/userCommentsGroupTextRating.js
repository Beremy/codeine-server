const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserCommentsGroupTextRating extends Model {}

  UserCommentsGroupTextRating.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "group_text_rating",
          key: "id",
        },
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "user_comments_group_text_rating",
      timestamps: false,
    }
  );

  return UserCommentsGroupTextRating;
};
