const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserSentenceSpecification extends Model {}

  UserSentenceSpecification.init(
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
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      word_positions: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      specification_weight: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "user_sentence_specification",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return UserSentenceSpecification;
};
