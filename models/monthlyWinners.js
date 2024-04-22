const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MonthlyWinners extends Model {}

  MonthlyWinners.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users", 
          key: "id",
        },
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: true, 
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ranking: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "monthly_winners",
      timestamps: false,
    }
  );

  return MonthlyWinners;
};
