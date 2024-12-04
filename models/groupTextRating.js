const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GroupTextRating extends Model {}

  GroupTextRating.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "texts",
          key: "id",
        },
      },
      sentence_positions: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      average_plausibility: {
        type: DataTypes.INTEGER,
      },
      votes_count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "group_text_rating",
      timestamps: false,
    }
  );

  return GroupTextRating;
};
