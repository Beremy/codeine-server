var express = require("express");
var router = express.Router();
const { MessageContact } = require("../models");
const utilsController = require("../controllers/utilsController");

router.post("/contactMessage", async function (req, res, next) {
  try {
    const { user_id, email, subject, message } = req.body;

    const newContactMessage = await MessageContact.create({
      user_id,
      email,
      subject,
      message,
    });

    res.json(newContactMessage);
  } catch (err) {
    next(err);
  }
});

router.delete("/deleteMessage/:id", utilsController.deleteMessage);

router.get("/getMessages", utilsController.getMessages);

module.exports = router;
