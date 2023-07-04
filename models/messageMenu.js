const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MessageMenu extends Model {
    static associate(models) {
      this.hasMany(models.Text, { foreignKey: "id_theme" });
    }
  }
  MessageMenu.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(45),
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
    },
    {
      sequelize,
      modelName: "message_menu",
      timestamps: false,
    }
  );
  return MessageMenu;
};
