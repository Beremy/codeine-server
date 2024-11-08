var express = require("express");
var router = express.Router();
const {
  UserSentenceSpecification,
  TestSpecification,
  Text,
} = require("../models/index.js");
const { sequelize } = require("../service/db.js");
const sentenceSpecificationsController = require("../controllers/sentenceSpecificationsController");
const { userAuthMiddleware } = require("../middleware/authMiddleware");

router.get("/", sentenceSpecificationsController.getAllSentenceSpecifications);

router.post("/sendResponse", userAuthMiddleware, sentenceSpecificationsController.sendResponse);

router.get("/getText", sentenceSpecificationsController.getText);

router.get("/getTextTestNegation", sentenceSpecificationsController.getTextTestNegation);

module.exports = router;
