const jwt = require("jsonwebtoken");
var express = require("express");
var router = express.Router();
const textController = require("../controllers/textController");
const errorController = require("../controllers/errorController");
const plausibilityController = require("../controllers/plausibilityController");

const {
  adminAuthMiddleware,
} = require("../middleware/authMiddleware");

router.post("/", adminAuthMiddleware, textController.createText);

router.get("/", adminAuthMiddleware, textController.getAllTexts);

router.get("/getTextTestPlausibility", plausibilityController.getTextTestPlausibility);
router.get(
  "/getTextWithTokensByGameType/:gameType",
  textController.getTextWithTokensByGameType
);
router.get(
  "/getTextWithTokensNotPlayed/:userId/:gameType",
  textController.getTextWithTokensNotPlayed
);
router.get(
  "/getSmallTextWithTokens/:gameType/:nbToken",
  textController.getSmallTextWithTokens
);
router.get(
  "/getSmallTextWithTokensNotPlayed/:userId/:gameType/:nbToken",
  textController.getSmallTextWithTokens
);

router.get(
  "/getTextWithTokensById/:textId",
  textController.getTextWithTokensById
);
router.get(
  "/getTextWithErrorValidatedNotPlayed/:userId",
  errorController.getTextWithErrorValidatedNotPlayed
);
router.get(
  "/getTextWithErrorValidated",
  errorController.getTextWithErrorValidated
);
router.get(
  "/getTextWithErrorValidatedByErrorId/:errorId",
  errorController.getTextWithErrorValidatedByErrorId
);
router.get(
  "/getTextTestWithErrorValidated",
  errorController.getTextTestWithErrorValidated
);
router.get(
  "/getNumberOfTexts",
  textController.getNumberOfTexts
);

// Administrateur
router.get("/:id", adminAuthMiddleware, textController.getTextById);
router.put("/:id", adminAuthMiddleware, textController.updateText);
router.delete("/:id", adminAuthMiddleware, textController.deleteText);

module.exports = router;
