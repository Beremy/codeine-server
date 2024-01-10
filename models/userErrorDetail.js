const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserErrorDetail extends Model {}

  UserErrorDetail.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      word_positions: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vote_weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_test: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      test_error_type_id: {
        type: DataTypes.INTEGER,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "user_error_details",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return UserErrorDetail;
};
