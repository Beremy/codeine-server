const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MessageMenu extends Model {}
  MessageMenu.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      message: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      message_type: {
        type: DataTypes.ENUM,
        values: ['home_not_connected', 'home_connected'],
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "message_menu",
      timestamps: false,
    }
  );
  return MessageMenu;
};
