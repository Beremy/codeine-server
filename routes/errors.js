var express = require("express");
var router = express.Router();
const { ErrorType, UserErrorDetail, UserTypingErrors, User } = require("../models");
const { checkAchievements } = require('../controllers/userController'); // Import the function

router.post("/sendResponse", async (req, res) => {
  console.log("\n");
  console.log("**************** sendResponse ************");
  const {
    userErrorDetailId,
    selectedErrorType,
    isTutorial,
    isInvisibleTest,
    userId,
  } = req.body;

  try {
    const userErrorDetail = await UserErrorDetail.findOne({
      where: { id: userErrorDetailId },
      include: [
        { model: ErrorType, attributes: ["id", "name"], as: "error_type" },
      ],
    });

    if (!userErrorDetail) {
      return res
        .status(404)
        .json({ success: false, message: "Error detail not found" });
    }

    let isUserCorrect = false;
    let pointsToAdd = 0, percentageToAdd = 0, trustIndexIncrement = 0;

    // Check if the error detail is a test
    if (userErrorDetail.is_test) {
      const correctAnswerId = userErrorDetail.test_error_type_id;
      isUserCorrect = selectedErrorType === correctAnswerId;

      if (isUserCorrect) {
        pointsToAdd = 3;
        percentageToAdd = 1;
        trustIndexIncrement = 2;
      } else {
        pointsToAdd = 0;
        percentageToAdd = 0;
        trustIndexIncrement = -1;
      }
    } else {
      // If not a test, we still need to handle the invisible test scenario
      if (isInvisibleTest) {
        // Adjust points as needed for invisible tests
        pointsToAdd = 3;
        percentageToAdd = 1;
        trustIndexIncrement = 2;
      }
      // No negative consequences if it's not a test and not an invisible test
    }

    const updatedStats = await updateUserStats(
      userId,
      pointsToAdd,
      percentageToAdd,
      trustIndexIncrement
    );

    const response = {
      success: isUserCorrect,
      newPoints: updatedStats.newPoints,
      newCatchProbability: updatedStats.newCatchProbability,
      newTrustIndex: updatedStats.newTrustIndex,
      newCoeffMulti: updatedStats.newCoeffMulti,
      newAchievements: updatedStats.newAchievements,
      showSkinModal: updatedStats.showSkinModal,
      skinData: updatedStats.skinData,
      showMessage: !isUserCorrect,
      message: isUserCorrect ? null : getCorrectionMessage(userErrorDetail.test_error_type_id),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


const updateUserStats = async (
  userId,
  pointsToAdd,
  percentageToAdd,
  trustIndexIncrement
) => {
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    let coeffTrustIndex = user.trust_index / 80;
    coeffTrustIndex = Math.max(coeffTrustIndex, 0);
    const additionalPoints = Math.round(
      pointsToAdd * coeffTrustIndex * user.coeffMulti
    );
    user.points += additionalPoints;

    user.catch_probability = Math.min(
      100,
      Math.max(0, user.catch_probability + percentageToAdd)
    );
    user.trust_index = Math.min(
      100,
      Math.max(0, user.trust_index + trustIndexIncrement)
    );

    const today = new Date();
    const lastPlayedDate = user.lastPlayedDate
      ? new Date(user.lastPlayedDate)
      : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const formatDate = (date) => date.toISOString().slice(0, 10);

    if (
      lastPlayedDate &&
      formatDate(lastPlayedDate) === formatDate(yesterday)
    ) {
      user.consecutiveDaysPlayed = (user.consecutiveDaysPlayed || 0) + 1;
    } else if (
      !lastPlayedDate ||
      formatDate(lastPlayedDate) !== formatDate(today)
    ) {
      user.consecutiveDaysPlayed = 1;
    }

    user.lastPlayedDate = formatDate(today);

    await user.save();

    const newAchievements = await userController.checkAchievements(user);
    const oldRewardTier = Math.floor(user.points / 100);
    const newRewardTier = Math.floor(user.points / 100);

    let showSkinModal = false;
    let skinData = null;

    if (newRewardTier > oldRewardTier) {
      const skinResponse = await getRandomSkin(user.id);
      showSkinModal = true;
      skinData = skinResponse;

      if (skinResponse.allSkinsUnlocked) {
        await updateUserStats(userId, 5, 0, 0, true);
      }
    }

    return {
      newPoints: user.points,
      newCatchProbability: user.catch_probability,
      newTrustIndex: user.trust_index,
      newCoeffMulti: user.coeffMulti,
      newAchievements,
      showSkinModal,
      skinData,
    };
  } catch (error) {
    throw new Error("Error updating user stats: " + error.message);
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

module.exports = router;

router.post("/createUserTypingError", async (req, res) => {
  const { user_id, user_error_details_id, error_type_id, sentence_positions } =
    req.body;

  try {
    const newUserTypingError = await UserTypingErrors.create({
      user_id: user_id,
      user_error_details_id: user_error_details_id,
      error_type_id: error_type_id,
    });

    const userErrorDetail = await UserErrorDetail.findOne({
      where: { id: user_error_details_id },
    });

    if (userErrorDetail) {
      let newVoteWeight = userErrorDetail.vote_weight;

      if (error_type_id === 10) {
        newVoteWeight = Math.max(userErrorDetail.vote_weight - 5, 0);
      } else {
        newVoteWeight = userErrorDetail.vote_weight + 3;
      }

      await userErrorDetail.update({ vote_weight: newVoteWeight });
    }

    res.status(201).json(newUserTypingError);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/getTypesError", async function (req, res, next) {
  try {
    const errorType = await ErrorType.findAll();
    res.status(200).json(errorType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getTypeByErrorId/:userErrorDetailId", async (req, res) => {
  const { userErrorDetailId } = req.params;
  try {
    const userErrorDetail = await UserErrorDetail.findOne({
      where: {
        id: userErrorDetailId,
      },
      include: [
        {
          model: ErrorType,
          attributes: ["id", "name"],
          as: "error_type",
        },
      ],
    });

    if (userErrorDetail && userErrorDetail.error_type) {
      const errorTypeData = userErrorDetail.error_type;
      res.status(200).json(errorTypeData);
    } else {
      res.status(404).json({ message: "Error not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/isErrorTest/:userErrorDetailId", async (req, res) => {
  const { userErrorDetailId } = req.params;
  try {
    const userErrorDetail = await UserErrorDetail.findOne({
      where: {
        id: userErrorDetailId,
      },
      attributes: ["is_test"],
    });

    if (userErrorDetail) {
      res.status(200).json({ isTest: userErrorDetail.is_test });
    } else {
      res.status(404).json({ message: "Error not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
