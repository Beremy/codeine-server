var express = require("express");
var router = express.Router();
const textController = require("../controllers/textController");

router.get("/getTextTestNegation", textController.getTextTestNegation);
router.get("/", textController.getAllTexts);
router.get("/getTextWithTokensByGameType/:gameType", textController.getTextWithTokensByGameType);
router.get("/getTextWithTokensNotPlayed/:userId/:gameType", textController.getTextWithTokensNotPlayed);
router.get("/getTextWithTokensById/:textId", textController.getTextWithTokensById);
router.get("/theme/:theme", textController.getTextsByTheme);
router.get("/origin/:origin", textController.getTextsByOrigin);
router.get("/getTextWithErrorValidatedNotPlayed/:userId", textController.getTextWithErrorValidatedNotPlayed);
router.get("/getTextWithErrorValidated", textController.getTextWithErrorValidated);
router.get("/:id", textController.getTextById);
router.post("/", textController.createText);
router.put("/:id", textController.updateText);
router.delete("/:id", textController.deleteText);

module.exports = router;
