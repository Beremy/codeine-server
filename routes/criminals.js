var express = require("express");
var router = express.Router();
const { Criminal, UserCriminal } = require("../models");
const { User, Achievement } = require("../models");
// const authMiddleware = require("../middleware/authMiddleware");

// router.get("/protected-route", authMiddleware, (req, res) => {
//   // Route protégée par l'authentification
// });

router.get("/:criminalId", async function (req, res) {
  const criminalId = req.params.criminalId;
  try {
    const criminal = await Criminal.findOne({
      where: {
        id: criminalId,
      },
    });
    if (!criminal) {
      return res.status(404).json({ error: "Criminal not found" });
    }
    res.status(200).json(criminal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/caughtByUserId/:userId", async function (req, res) {
  const userId = req.params.userId;
  try {
    const userCriminals = await UserCriminal.findAll({
      where: { user_id: userId },
      include: [{ model: Criminal }],
      order: [["criminal_id", "DESC"]], // Ajouter l'option de tri ici
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
    return newAchievements;
  } catch (err) {
    console.error("An error occurred while checking achievements:", err);
    throw err;
  }
}

router.post("/catchCriminal", async function (req, res) {
  const { userId } = req.body;

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Sélection du dernier criminel attrapé par l'utilisateur
    const lastCaught = await UserCriminal.findOne({
      where: { user_id: userId },
      order: [["criminal_id", "DESC"]],
    });

    // Calcul ID du prochain criminel à attraper
    const nextCriminalId = lastCaught ? lastCaught.criminal_id + 1 : 1;

    const totalCriminalsCount = await Criminal.count();
    if (nextCriminalId > totalCriminalsCount) {
      // Cas où tous les criminels ont été attrapés
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

    const caughtCriminalsCount = await UserCriminal.count({
      where: { user_id: userId },
    });

    // Détails de l'arrestation avec un drapeau indiquant si tous les criminels ont été attrapés
    const newAchievements = await checkCriminalAchievements(user,caughtCriminalsCount);
    const allCriminalsCaught = caughtCriminalsCount >= totalCriminalsCount;
    return res.status(200).json({
      catchEntry,
      descriptionArrest: criminalDetails.descriptionArrest,
      allCriminalsCaught,
      newAchievements,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
