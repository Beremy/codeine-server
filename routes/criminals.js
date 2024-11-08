var express = require("express");
var router = express.Router();
const { Criminal, UserCriminal } = require("../models");
const { User, Achievement } = require("../models");
const {
  updateUserCoeffMulti,
  updateUserStats,
} = require("../controllers/userController");
const { userAuthMiddleware } = require("../middleware/authMiddleware");

router.get("/caughtByUserId", userAuthMiddleware, async function (req, res) {
  try {
    const userId = req.user.id;
    const userCriminals = await UserCriminal.findAll({
      where: { user_id: userId },
      include: [{ model: Criminal }],
      order: [["criminal_id", "DESC"]],
    });
    const criminals = userCriminals.map((uc) => uc.criminal);
    if (criminals.length === 0) {
      return res.status(404).json({ error: "No criminals found for user" });
    }
    res.status(200).json(criminals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function checkCriminalAchievements(user, caughtCriminalsCount) {
  try {
    const criminalAchievements = [
      { id: "7", count: 1 },
      { id: "8", count: 3 },
      { id: "9", count: 6 },
      { id: "10", count: 9 },
    ];

    let newAchievements = [];

    // Vérification des hauts faits liés aux criminels
    for (const achievement of criminalAchievements) {
      const existingAchievement = await user.getAchievements({
        where: { id: achievement.id },
      });
      if (
        existingAchievement.length === 0 &&
        caughtCriminalsCount >= achievement.count
      ) {
        const newAchievement = await Achievement.findByPk(achievement.id);
        if (newAchievement) {
          await user.addAchievement(newAchievement, {
            through: { notified: false },
          });
          newAchievements.push(newAchievement);
        }
      }
    }
    if (newAchievements.length > 0) {
      await updateUserCoeffMulti(user);
    }
    return newAchievements;
  } catch (err) {
    console.error("An error occurred while checking achievements:", err);
    throw err;
  }
}

router.post("/catchCriminal", userAuthMiddleware, async function (req, res) {
  const userId = req.user.id;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Convertir catch_probability en nombre flottant
    const catchProbability = parseFloat(user.catch_probability);

    // Calculer la probabilité d'arrestation
    const randomNumber = Math.floor(Math.random() * 101);

    if (randomNumber > catchProbability) {
      // Si l'arrestation échoue, réduire catch_probability de 15
      const updatedStats = await updateUserStats(userId, 0, -15, 0, null, true);

      return res.status(200).json({
        success: false,
        message: "L'arrestation a échoué, vous avez perdu 15% de probabilité.",
        newCatchProbability: updatedStats.newCatchProbability, // Retour de la nouvelle valeur
      });
    } else {
      const totalCriminalsCount = await Criminal.count();

      // Compter le nombre de criminels attrapés par l'utilisateur
      const caughtCriminalsCount = await UserCriminal.count({
        where: { user_id: userId },
      });

      // Si l'utilisateur a déjà attrapé tous les criminels
      if (caughtCriminalsCount >= totalCriminalsCount) {
        // Ajouter 5 points au joueur
        const oldPoints = user.points;
        const updatedStats = await updateUserStats(userId, 5, 0, 0, null);

        // Calculer le nombre de points gagnés
        const pointsGained = updatedStats.newPoints - oldPoints;

        return res.status(200).json({
          success: true,
          message: "No more criminals to catch",
          allCriminalsCaught: true,
          pointsAdded: pointsGained,
          newCatchProbability: updatedStats.newCatchProbability, // Retour de la nouvelle valeur
        });
      }

      // Sélection du dernier criminel attrapé par l'utilisateur
      const lastCaught = await UserCriminal.findOne({
        where: { user_id: userId },
        order: [["criminal_id", "DESC"]],
      });

      // Calcul ID du prochain criminel à attraper
      const nextCriminalId = lastCaught ? lastCaught.criminal_id + 1 : 1;
      if (nextCriminalId > totalCriminalsCount) {
        return res.status(200).json({
          message: "No more criminals to catch",
          allCriminalsCaught: true,
        });
      }

      const alreadyCaught = await UserCriminal.findOne({
        where: { user_id: userId, criminal_id: nextCriminalId },
      });
      if (alreadyCaught) {
        return res
          .status(409)
          .json({ error: "Criminal already caught by this user" });
      }

      const catchEntry = await UserCriminal.create({
        user_id: userId,
        criminal_id: nextCriminalId,
      });

      const criminalDetails = await Criminal.findByPk(nextCriminalId);
      if (!criminalDetails) {
        return res
          .status(404)
          .json({ error: "Criminal details not found after catch" });
      }

      // Vérification des hauts faits après l'arrestation
      const newAchievements = await checkCriminalAchievements(
        user,
        caughtCriminalsCount + 1
      );

      // Définir allCriminalsCaught à true uniquement si on a attrapé le dernier criminel
      const allCriminalsCaught = caughtCriminalsCount + 1 > totalCriminalsCount;

      // Réinitialiser la probabilité de capture après une arrestation réussie
      await updateUserStats(userId, 0, -catchProbability, 0, null, true);

      return res.status(200).json({
        success: true,
        catchEntry,
        descriptionArrest: criminalDetails.descriptionArrest,
        allCriminalsCaught,
        newCatchProbability: 0, // Réinitialiser à 0 après une arrestation réussie
        newAchievements,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
