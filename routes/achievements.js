var express = require("express");
var router = express.Router();
const { Achievement, UserAchievement } = require("../models");
// const authMiddleware = require("../middleware/authMiddleware");

// router.get("/protected-route", authMiddleware, (req, res) => {
//   // Route protégée par l'authentification
// });

/* GET achievements listing. */
router.get("/", async function (req, res, next) {
  try {
    const achievements = await Achievement.findAll();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/byUserId/:userId", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const userAchievements = await UserAchievement.findAll({
      where: { user_id: userId },
      include: [{
        model: Achievement,
      }]
    });
    const achievements = userAchievements.map(ua => ua.achievement);
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;