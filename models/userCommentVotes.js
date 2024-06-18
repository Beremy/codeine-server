const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserCommentVotes extends Model {}
  
  UserCommentVotes.init(
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
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_comments_group_text_rating",
          key: "id",
        },
      },
      vote_type: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "user_comment_votes",
      timestamps: false,
    }
  );

  return UserCommentVotes;
};
