var express = require("express");
var router = express.Router();
const { Text, UserErrorDetail, TestPlausibilityError } = require("../models");
const { Op } = require("sequelize");
const {
  updateUserStats,
  getUserById,
} = require("../controllers/userController");
const {
  createUserTextRating,
  createUserErrorDetail,
} = require("../controllers/errorController");

const checkUserSelectionPlausibility = async (
  textId,
  userErrorDetails,
  userRateSelected,
  plausibilityMargin = 25,
  tokenErrorMargin = 1
) => {
  try {
    const textDetails = await getTextDetailsById(textId);
    if (!textDetails) throw new Error("Text details not found");

    const testPlausibilityError = await getTestPlausibilityErrorByTextId(
      textId
    );

    const textPlausibility = parseFloat(textDetails.test_plausibility);
    const isPlausibilityCorrect =
      Math.abs(userRateSelected - textPlausibility) <= plausibilityMargin;

    let isValid = isPlausibilityCorrect;
    let reasonForRate = textDetails.reason_for_rate || "";

    const isErrorDetailsCorrect =
      testPlausibilityError.length > 0
        ? areUserErrorsCorrect(
            userErrorDetails,
            testPlausibilityError,
            tokenErrorMargin
          )
        : true;

    return {
      isValid: isValid && isErrorDetailsCorrect,
      testPlausibilityError: isErrorDetailsCorrect ? [] : testPlausibilityError,
      correctPlausibility: textPlausibility,
      testPlausibilityPassed: isPlausibilityCorrect,
      isErrorDetailsCorrect,
      reasonForRate,
    };
  } catch (error) {
    console.error("Error in checkUserSelectionPlausibility:", error);
    return {
      isValid: false,
      testPlausibilityError: [],
    };
  }
};

const areUserErrorsCorrect = (
  userErrorDetails,
  testPlausibilityError,
  tokenErrorMargin
) => {
  const allTestErrorPositions = testPlausibilityError.flatMap((spec) =>
    spec.word_positions.split(",").map((pos) => parseInt(pos))
  );

  return userErrorDetails.some((errorDetail) => {
    const userWordPositions = errorDetail.word_positions
      .split(",")
      .map((pos) => parseInt(pos));
    return userWordPositions.some((userPos) =>
      allTestErrorPositions.some(
        (testPos) => Math.abs(testPos - userPos) <= tokenErrorMargin
      )
    );
  });
};

// TODO Verif du token user
router.post("/sendResponse", async (req, res) => {
  const { textId, userErrorDetails, userRateSelected, userId } = req.body;

  try {
    let pointsToAdd = 0,
      percentageToAdd = 0,
      trustIndexIncrement = 0;
    let success = false;
    let message = null;
    let checkResult = null;

    const textDetails = await getTextDetailsById(textId);

    if (!textDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Text not found" });
    }

    if (textDetails.is_plausibility_test) {
      checkResult = await checkUserSelectionPlausibility(
        textId,
        userErrorDetails,
        userRateSelected
      );

      const noErrorSpecified = userErrorDetails.length === 0;
      const noErrorInDatabase = checkResult.testPlausibilityError.length === 0;

      if (noErrorSpecified || noErrorInDatabase) {
        if (checkResult.testPlausibilityPassed) {
          pointsToAdd = 10;
          percentageToAdd = 1;
          trustIndexIncrement = 1;
          success = true;
        } else {
          pointsToAdd = 0;
          percentageToAdd = 0;
          trustIndexIncrement = -1;
          success = false;
          message = checkResult.reasonForRate;
        }
      } else {
        const correctSpecification = checkResult.testPlausibilityError
          .map((spec) => `• ${spec.content}`)
          .join("\n");
        const allPositions = checkResult.testPlausibilityError.flatMap((spec) =>
          spec.word_positions.split(",").map((pos) => parseInt(pos))
        );

        if (
          !checkResult.isErrorDetailsCorrect &&
          checkResult.testPlausibilityPassed
        ) {
          pointsToAdd = 10;
          percentageToAdd = 1;
          trustIndexIncrement = 1;
          success = false;
          message = `Vous avez bien estimé la plausibilité, mais voilà les erreurs qu'il fallait trouver :\n${correctSpecification}`;
        } else if (
          !checkResult.isErrorDetailsCorrect &&
          !checkResult.testPlausibilityPassed
        ) {
          pointsToAdd = 0;
          percentageToAdd = 0;
          trustIndexIncrement = -1;
          success = false;
          message = `${checkResult.reasonForRate}\nLes erreurs à trouver étaient :\n${correctSpecification}`;
        } else if (
          checkResult.isErrorDetailsCorrect &&
          !checkResult.testPlausibilityPassed
        ) {
          pointsToAdd = 10 + userErrorDetails.length;
          percentageToAdd = 1;
          trustIndexIncrement = 1;
          success = false;
          message =
            "Vous avez bien identifié les zones de doute, mais la plausibilité estimée était incorrecte.";
        } else if (
          checkResult.isErrorDetailsCorrect &&
          checkResult.testPlausibilityPassed
        ) {
          pointsToAdd = 14 + userErrorDetails.length;
          percentageToAdd = 1;
          trustIndexIncrement = 2;
          success = true;
        }
      }
    } else {
      // non-test scenario
      const user = await getUserById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const vote_weight =
        user.status === "medecin" ? user.trust_index + 30 : user.trust_index;

      additionalPoints = userErrorDetails.length;
      pointsToAdd = 10 + additionalPoints;
      percentageToAdd = 1;
      trustIndexIncrement = 0;
      success = true;

      const userTextRating = {
        user_id: userId,
        text_id: textId,
        plausibility: userRateSelected,
        vote_weight: vote_weight,
      };
      await createUserTextRating(userTextRating);

      for (let errorDetail of userErrorDetails) {
        await createUserErrorDetail({
          ...errorDetail,
          user_id: userId,
          text_id: textId,
          vote_weight: vote_weight,
        });
      }
    }

    const updatedStats = await updateUserStats(
      userId,
      pointsToAdd,
      percentageToAdd,
      trustIndexIncrement
    );

    const response = {
      success: success,
      newPoints: updatedStats.newPoints,
      newCatchProbability: updatedStats.newCatchProbability,
      newTrustIndex: updatedStats.newTrustIndex,
      newCoeffMulti: updatedStats.newCoeffMulti,
      newAchievements: updatedStats.newAchievements,
      showSkinModal: updatedStats.showSkinModal,
      skinData: updatedStats.skinData,
      message: message,
      correctPositions: checkResult
        ? checkResult.testPlausibilityError.map((spec) =>
            spec.word_positions.split(",").map((pos) => parseInt(pos))
          )
        : [],
      correctPlausibility:
        checkResult && !checkResult.testPlausibilityPassed
          ? checkResult.correctPlausibility
          : null,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in sendPlausibilityResponse:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/getErrorDetailTest/:textId", async function (req, res, next) {
  const textId = req.params.textId;

  try {
    const plausibilityErrors = await UserErrorDetail.findAll({
      where: {
        text_id: textId,
        is_test: true,
        test_error_type_id: {
          [Op.ne]: 10, // Enlever les erreurs qui sont typées "non erreur"
        },
      },
    });
    res.status(200).json(plausibilityErrors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.get("/correctPlausibility/:textId", async function (req, res, next) {
//   const textId = req.params.textId;
//   try {
//     const text = await Text.findOne({
//       where: {
//         id: textId,
//       },
//     });

//     res.status(200).json({ test_plausibility: text.test_plausibility });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.post("/", async function (req, res, next) {
//   try {
//     const newPlausibilityError = await UserErrorDetail.create(req.body);
//     res.status(201).json(newPlausibilityError);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// const getTestPlausibilityErrorByTextId = async (textId) => {
//   try {
//     const testPlausibilityErrors = await UserErrorDetail.findAll({
//       where: {
//         text_id: textId,
//         is_test: true,
//       },
//       attributes: ["id", "text_id", "word_positions", "content"], // spécifiez ici les attributs que vous souhaitez récupérer
//     });
//     return testPlausibilityErrors.map((error) => {
//       return {
//         id: error.id,
//         text_id: error.text_id,
//         word_positions: error.word_positions,
//         content: error.content,
//       };
//     });
//   } catch (error) {
//     console.error(
//       "Error fetching test plausibility errors from UserErrorDetail:",
//       error
//     );
//     throw new Error(
//       "Error fetching test plausibility errors from UserErrorDetail"
//     );
//   }
// };

const getTextDetailsById = async (textId) => {
  try {
    const textDetails = await Text.findOne({
      where: { id: textId },
      attributes: [
        "test_plausibility",
        "reason_for_rate",
        "is_plausibility_test",
      ],
    });
    return textDetails;
  } catch (error) {
    console.error("Error fetching text details:", error);
    throw new Error("Error fetching text details");
  }
};

module.exports = router;
