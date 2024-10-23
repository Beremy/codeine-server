var express = require("express");
var router = express.Router();
const { MessageContact } = require("../models");
const messagesController = require("../controllers/messagesController");

const { adminAuthMiddleware } = require("../middleware/authMiddleware");

router.post("/contactMessage", async function (req, res, next) {
  try {
    const { user_id, username, email, subject, message } = req.body;

    const newContactMessage = await MessageContact.create({
      user_id,
      username,
      email,
      subject,
      message,
    });

    res.json(newContactMessage);
  } catch (err) {
    next(err);
  }
});

router.delete("/deleteMessage/:id", adminAuthMiddleware, messagesController.deleteMessage);

router.get("/getMessages", adminAuthMiddleware, messagesController.getMessages);


// **************** Message menu ********************

router.put("/notifyAllUsers", adminAuthMiddleware, messagesController.notifyAllUsers);

router.get("/messagesMenu", messagesController.getMessagesMenu);

router.put("/updateMessageMenu/type/:messageType", adminAuthMiddleware, messagesController.updateMessageMenu);

module.exports = router;
