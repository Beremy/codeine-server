var express = require("express");
var router = express.Router();
const sentenceController = require("../controllers/sentenceController");

router.get("/", sentenceController.getAllSentences);
router.get("/:id", sentenceController.getSentenceById);
router.get("/random/:amount", sentenceController.getRandomSentences);

module.exports = router;
