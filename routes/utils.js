var express = require("express");
var router = express.Router();
const { MessageMenu } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/protected-route", authMiddleware, (req, res) => {
  // Route protégée par l'authentification
});

router.get("/messageMenu", async function (req, res, next) {
  try {
    const messageMenu = await MessageMenu.findOne({ where: { active: true }});
    res.json(messageMenu);
  } catch (err) {
    next(err);
  }
});

router.put("/messageMenu", async function (req, res, next) {
  try {
    const existingMessageMenu = await MessageMenu.findByPk(1);
    if (existingMessageMenu) {
      existingMessageMenu.title = req.body.title;
      existingMessageMenu.message = req.body.message;
      existingMessageMenu.active = req.body.active;
      await existingMessageMenu.save();
      res.json(existingMessageMenu);
    } else {
      res.status(404).send('Message not found');
    }
  } catch (err) {
    next(err);
  }
});

// router.post("/messageMenu", async function (req, res, next) {
//   try {
//     const newMessageMenu = await MessageMenu.create(req.body);
//     res.json(newMessageMenu);
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = router;
