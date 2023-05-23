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
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      text_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'texts', // 'Texts' refers to table name
          key: 'id', // 'id' refers to column name in Texts table
        }
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
