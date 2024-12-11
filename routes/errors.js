var express = require("express");
var router = express.Router();
const {
  ErrorType,
  UserErrorDetail,
  UserTypingErrors,
  Token,
  Text,
} = require("../models");
const {
  updateUserStats,
  getUserById,
} = require("../controllers/userController");
const { sequelize } = require("../service/db.js");
const { userAuthMiddleware } = require("../middleware/authMiddleware");
const { Op } = require("sequelize");
const { getVariableFromCache } = require("../service/cache");

router.get("/getTextMythoTypo", async function (req, res, next) {
  try {
    const percentage_test_mythotypo =
      getVariableFromCache("percentage_test_mythotypo") || 30;
    const randomNumber = Math.floor(Math.random() * 100);
    if (randomNumber < percentage_test_mythotypo) {
      const userErrorDetail = await UserErrorDetail.findOne({
        where: {
          is_test: true,
        },
        include: {
          model: Text,
          include: [
            {
              model: Token,
              attributes: ["id", "content", "position", "is_punctuation"],
            },
          ],
        },
        order: sequelize.literal("RAND()"),
      });

      if (!userErrorDetail) {
        return res
          .status(404)
          .json({ error: "No text with test errors found" });
      }

      userErrorDetail.text.tokens.sort((a, b) => a.position - b.position);

      res.status(200).json({
        id: userErrorDetail.text.id,
        num: userErrorDetail.text.num,
        idUserErrorDetail: userErrorDetail.id,
        positionErrorTokens: userErrorDetail.word_positions,
        tokens: userErrorDetail.text.tokens,
      });
    } else {
      const { userId } = req.params;

      // Recherche d'une erreur non jouée par l'utilisateur avec vote_weight supérieur à 50
      const userErrorDetail = await UserErrorDetail.findOne({
        where: {
          vote_weight: { [Op.gte]: 50 },
        },
        include: {
          model: Text,
          include: [
            {
              model: Token,
              attributes: ["id", "content", "position", "is_punctuation"],
            },
          ],
        },
        order: sequelize.literal("RAND()"),
      });

      if (!userErrorDetail) {
        return res
          .status(404)
          .json({ error: "No text with unplayed errors found" });
      }

      userErrorDetail.text.tokens.sort((a, b) => a.position - b.position);

      // Renvoyer le texte avec une erreur non jouée
      res.status(200).json({
        id: userErrorDetail.text.id,
        num: userErrorDetail.text.num,
        vote_weight: userErrorDetail.vote_weight,
        idUserErrorDetail: userErrorDetail.id,
        userIdUserErrorDetail: userErrorDetail.userId,
        positionErrorTokens: userErrorDetail.word_positions,
        tokens: userErrorDetail.text.tokens,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/sendResponse", userAuthMiddleware, async (req, res) => {
  const { userErrorDetailId, selectedErrorType } = req.body;
  const transaction = await sequelize.transaction();
  const userId = req.user.id;

  try {
    const base_points_earned_mythotypo =
      getVariableFromCache("base_points_earned_mythotypo") || 3;
    const base_catchability_mythotypo =
      getVariableFromCache("base_catchability_mythotypo") || 3;

    const userErrorDetail = await UserErrorDetail.findOne({
      where: { id: userErrorDetailId },
      include: [
        { model: ErrorType, attributes: ["id", "name"], as: "error_type" },
      ],
      transaction,
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
        pointsToAdd = base_points_earned_mythotypo;
        percentageToAdd = base_catchability_mythotypo;
        trustIndexIncrement = 1;
      } else {
        pointsToAdd = 0;
        percentageToAdd = 0;
        trustIndexIncrement = -1;
        if (
          userErrorDetail.reason_for_type &&
          userErrorDetail.reason_for_type.trim() !== ""
        ) {
          message = userErrorDetail.reason_for_type;
        } else {
          message = getCorrectionMessage(userErrorDetail.test_error_type_id);
        }
      }
      success = isUserCorrect;
    } else {
      pointsToAdd = base_points_earned_mythotypo;
      percentageToAdd = base_catchability_mythotypo;
      trustIndexIncrement = 0;
      success = true;

      await createUserTypingError(
        userId,
        userErrorDetailId,
        selectedErrorType,
        transaction
      );
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

// Par contre c'est bizarre, quand je crée le UserTypingErrors, le weight reste
const createUserTypingError = async (
  userId,
  userErrorDetailId,
  errorTypeId
) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await getUserById(userId);

    const baseWeight = user.trust_index;
    const typingWeight =
      user.status === "medecin" ? baseWeight + baseWeight * 0.3 : baseWeight;

    await UserTypingErrors.create(
      {
        user_id: userId,
        user_error_details_id: userErrorDetailId,
        error_type_id: errorTypeId,
        weight: typingWeight,
      },
      { transaction }
    );

    const userErrorDetail = await UserErrorDetail.findOne(
      {
        where: { id: userErrorDetailId },
      },
      { transaction }
    );

    if (userErrorDetail) {
      let newVoteWeight = userErrorDetail.vote_weight;

      if (errorTypeId === 10) {
        newVoteWeight = Math.max(userErrorDetail.vote_weight - 5, 0);
      } else {
        newVoteWeight = userErrorDetail.vote_weight + 3;
      }

      await userErrorDetail.update(
        { vote_weight: newVoteWeight },
        { transaction }
      );
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
