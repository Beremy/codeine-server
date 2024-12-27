const jwt = require("jsonwebtoken");
var express = require("express");
var router = express.Router();
const textController = require("../controllers/textController");
const errorController = require("../controllers/errorController");
const plausibilityController = require("../controllers/plausibilityController");
const multer = require("multer");
const upload = multer({ dest: "../uploads/" }); // Stockage temporaire des fichiers
const fs = require("fs");
const path = require("path");

const {
  adminAuthMiddleware,
} = require("../middleware/authMiddleware");


router.post("/bulk", upload.single("file"), async (req, res) => {
  try {
    console.log("function");
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, "utf-8");
console.log(fileContent);
const texts = JSON.parse(fileContent);

    await textController.createSeveralTexts({ body: { texts } }, res);

    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(`Error processing file: ${error}`);
    res.status(500).json({ error: error.message });
  }
});


router.post("/", adminAuthMiddleware, textController.createText);


router.get("/", adminAuthMiddleware, textController.getAllTexts);

router.get("/getTextTestPlausibility", plausibilityController.getTextTestPlausibility);

router.get(
  "/getTextWithTokensById/:textId",
  textController.getTextWithTokensById
);
// router.get(
//   "/getTextWithErrorValidatedNotPlayed/:userId",
//   errorController.getTextWithErrorValidatedNotPlayed
// );
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
