const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Sentence extends Model {}
  Sentence.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      text_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'texts',
          key: 'id',
        }
      },
      content: {
        type: DataTypes.TEXT,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "sentences",
      timestamps: false,
    }
  );
  return Sentence;
};