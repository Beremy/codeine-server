var express = require("express");
var router = express.Router();
const { Game, UserTutorial } = require("../models");

router.get("/tutorialsCompleted/:userId", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const tutorialsCompleted = await UserTutorial.findAll({
      where: { 
        user_id: userId,
        completed: true
      },
      include: [{
        model: Game,
        attributes: ['name']
      }]
    });
    const gamesCompleted = tutorialsCompleted.map(tut => tut.game);
    res.status(200).json(gamesCompleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/tutorialCompleted/:userId/:gameId", async function (req, res, next) {
  try {
    const { userId, gameId } = req.params;
    const tutorialCompleted = await UserTutorial.findOne({
      where: { 
        user_id: userId,
        game_id: gameId,
        completed: true
      },
    });
    if (tutorialCompleted) {
      res.status(200).json({ completed: true });
    } else {
      res.status(200).json({ completed: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/completeTutorial", async (req, res, next) => {
  try {
    const { userId, gameId } = req.body;

    const tutorial = await UserTutorial.findOne({
      where: {
        user_id: userId,
        game_id: gameId
      }
    });

    if (tutorial) {
      tutorial.completed = true;
      await tutorial.save();
    } else {
      await UserTutorial.create({
        user_id: userId,
        game_id: gameId,
        completed: true
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;