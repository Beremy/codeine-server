// const { Model } = require("sequelize");

// module.exports = (sequelize, DataTypes) => {
//   class TestPlausibilityError extends Model {}

//   TestPlausibilityError.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       text_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//           model: "texts",
//           key: "id",
//         },
//       },
//       content: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       word_positions: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       type: {
//         type: DataTypes.STRING,
//       },
//     },
//     {
//       sequelize,
//       modelName: "test_plausibility_errors",
//       timestamps: false,
//     }
//   );

//   return TestPlausibilityError;
// };
