const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MessageContact extends Model {}

  MessageContact.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users", 
          key: "id",
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true, 
      },
      subject: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "message_contact",
      timestamps: false,
    }
  );

  return MessageContact;
};
