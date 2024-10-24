var express = require("express");
var router = express.Router();
const {
  UserSentenceSpecification,
  TestSpecification,
  Text,
} = require("../models/index.js");
const { sequelize } = require("../service/db.js");
const sentenceSpecificationsController = require("../controllers/sentenceSpecificationsController");

router.get("/", sentenceSpecificationsController.getAllSentenceSpecifications);

// TODO Verif du token user
router.post("/sendResponse", sentenceSpecificationsController.sendResponse);

router.get("/getText", sentenceSpecificationsController.getText);

router.get("/getTextTestNegation", sentenceSpecificationsController.getTextTestNegation);


// Inutilisé pour le moment
router.get("/getNumberSpecifications", async function (req, res) {
  try {
    const numberSpecifications = await UserSentenceSpecification.count();
    res.status(200).json(numberSpecifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
