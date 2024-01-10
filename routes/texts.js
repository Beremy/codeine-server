var express = require("express");
var router = express.Router();
const textController = require("../controllers/textController");
const errorController = require("../controllers/errorController");


router.get("/", textController.getAllTexts);
router.get("/getTextTestPlausibility", textController.getTextTestPlausibility);
router.get("/getTextTestNegation", textController.getTextTestNegation);
router.get("/getTextWithTokensByGameType/:gameType", textController.getTextWithTokensByGameType);
router.get("/getTextWithTokensNotPlayed/:userId/:gameType", textController.getTextWithTokensNotPlayed);
router.get("/getTextWithTokensById/:textId", textController.getTextWithTokensById);
router.get("/theme/:theme", textController.getTextsByTheme);
router.get("/origin/:origin", textController.getTextsByOrigin);
router.get("/getTextWithErrorValidatedNotPlayed/:userId", errorController.getTextWithErrorValidatedNotPlayed);
router.get("/getTextWithErrorValidated", errorController.getTextWithErrorValidated);
router.post("/createUserErrorDetail", errorController.createUserErrorDetail);
router.post("/createUserTextRating", errorController.createUserTextRating);
router.get("/getTextTestWithErrorValidated", errorController.getTextTestWithErrorValidated);
router.get("/:id", textController.getTextById);
router.post("/", textController.createText);
router.put("/:id", textController.updateText);
router.delete("/:id", textController.deleteText);

module.exports = router;
