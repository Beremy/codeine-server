var express = require("express");
var router = express.Router();
const { Achievement, UserAchievement } = require("../models");
const { userAuthMiddleware } = require("../middleware/authMiddleware");

const getAchievementsByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const userAchievements = await UserAchievement.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Achievement,
        },
      ],
    });
    const achievements = userAchievements.map((ua) => ua.achievement);
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/************* ROUTES *************/
router.get("/", async function (req, res, next) {
  try {
    const achievements = await Achievement.findAll();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/byUserId", userAuthMiddleware, getAchievementsByUserId);


module.exports = router;
