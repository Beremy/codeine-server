const jwt = require("jsonwebtoken");
var express = require("express");
var router = express.Router();
const textController = require("../controllers/textController");
const errorController = require("../controllers/errorController");

const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).send("Un token est requis pour l'authentification.");
  }

  const parts = authHeader.split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    const token = parts[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Vérification si l'utilisateur est un modérateur
      if (decoded.moderator) {
        req.user = decoded;
        next();
      } else {
        return res
          .status(403)
          .json({ error: "Accès refusé. Réservé aux administrateurs." });
      }
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ error: "Token mal formaté" });
  }
};


router.post("/", adminAuthMiddleware, textController.createText);

router.get("/", adminAuthMiddleware, textController.getAllTexts);

router.get("/getTextTestPlausibility", textController.getTextTestPlausibility);
router.get("/getTextTestNegation", textController.getTextTestNegation);
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
router.get("/theme/:theme", textController.getTextsByTheme);
// router.get("/origin/:origin", textController.getTextsByOrigin);
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
// router.post("/createUserErrorDetail", errorController.createUserErrorDetail);
// router.post("/createUserTextRating", errorController.createUserTextRating);
router.get(
  "/getTextTestWithErrorValidated",
  errorController.getTextTestWithErrorValidated
);

// Administrateur
router.get("/:id", adminAuthMiddleware, textController.getTextById);
router.put("/:id", adminAuthMiddleware, textController.updateText);
router.delete("/:id", adminAuthMiddleware, textController.deleteText);

module.exports = router;
