const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class errorVote extends Model {}

  errorVote.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      error_details_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "error_details",
          key: "id",
        },
      },
      user_text_rating_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_text_rating", 
          key: "id",
        },
      },
      vote_weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "error_votes",
    }
  );

  return errorVote;
};