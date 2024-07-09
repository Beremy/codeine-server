var express = require("express");
var router = express.Router();
const {
  ErrorType,
  UserErrorDetail,
  UserTypingErrors
} = require("../models");
const { updateUserStats } = require("../controllers/userController");
const { sequelize } = require("../service/db.js");

// TODO Verif du token user
router.post("/sendResponse", async (req, res) => {
  const { userErrorDetailId, selectedErrorType, userId } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const userErrorDetail = await UserErrorDetail.findOne({
      where: { id: userErrorDetailId },
      include: [
        { model: ErrorType, attributes: ["id", "name"], as: "error_type" },
      ],
      transaction
    });

    if (!userErrorDetail) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Error detail not found" });
    }

    let isUserCorrect = false;
    let pointsToAdd = 0,
        percentageToAdd = 0,
        trustIndexIncrement = 0;
    let success = false;
    let message = null;

    if (userErrorDetail.is_test) {
      const correctAnswerId = userErrorDetail.test_error_type_id;
      isUserCorrect = selectedErrorType === correctAnswerId;

      if (isUserCorrect) {
        pointsToAdd = 3;
        percentageToAdd = 1;
        trustIndexIncrement = 1;
      } else {
        pointsToAdd = 0;
        percentageToAdd = 0;
        trustIndexIncrement = -1;
        message = getCorrectionMessage(userErrorDetail.test_error_type_id);
      }
      success = isUserCorrect;
    } else {
      pointsToAdd = 3;
      percentageToAdd = 1;
      trustIndexIncrement = 0;
      success = true;

      await createUserTypingError(userId, userErrorDetailId, selectedErrorType, transaction);
    }

    const updatedStats = await updateUserStats(
      userId,
      pointsToAdd,
      percentageToAdd,
      trustIndexIncrement,
      transaction
    );

    await transaction.commit();

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
    };

    res.status(200).json(response);
  } catch (error) {
    await transaction.rollback();
    console.error("Error processing response:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


const createUserTypingError = async (userId, userErrorDetailId, errorTypeId) => {
  const transaction = await sequelize.transaction();

  try {
    await UserTypingErrors.create({
      user_id: userId,
      user_error_details_id: userErrorDetailId,
      error_type_id: errorTypeId,
    }, { transaction });

    const userErrorDetail = await UserErrorDetail.findOne({
      where: { id: userErrorDetailId },
    }, { transaction });

    if (userErrorDetail) {
      let newVoteWeight = userErrorDetail.vote_weight;

      if (errorTypeId === 10) {
        newVoteWeight = Math.max(userErrorDetail.vote_weight - 5, 0);
      } else {
        newVoteWeight = userErrorDetail.vote_weight + 3;
      }

      await userErrorDetail.update({ vote_weight: newVoteWeight }, { transaction });
      console.error("UserErrorDetail vote_weight updated");
    } else {
      console.error("UserErrorDetail not found");
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error("Error in createUserTypingError:", error.message);
    throw new Error(error.message);
  }
};

const getCorrectionMessage = (errorTypeId) => {
  switch (errorTypeId) {
    case 1:
      return "L'erreur était plutôt une faute de français.";
    case 2:
      return "L'erreur concerne la cohérence médicale du texte.";
    case 3:
      return "L'erreur est une répétition.";
    case 4:
      return "L'erreur appartient à une autre catégorie.";
    default:
      return "Ce n'était pas une erreur.";
  }
};

router.get("/getTypesError", async function (req, res, next) {
  try {
    const errorType = await ErrorType.findAll();
    res.status(200).json(errorType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
