var express = require("express");
var router = express.Router();
const textController = require("../controllers/textController");

router.get("/getTextTestNegation", textController.getTextTestNegation);
router.get("/", textController.getAllTexts);
router.get("/getTextWithTokens/:userId/:gameType", textController.getTextWithTokens);
router.get("/getTextWithTokensById/:textId", textController.getTextWithTokensById);
router.get("/theme/:theme", textController.getTextsByTheme);
router.get("/origin/:origin", textController.getTextsByOrigin);
router.get("/getTextWithErrorValidated/:userId", textController.getTextWithErrorValidated);
router.get("/:id", textController.getTextById);
router.post("/", textController.createText);
router.put("/:id", textController.updateText);
router.delete("/:id", textController.deleteText);

module.exports = router;
