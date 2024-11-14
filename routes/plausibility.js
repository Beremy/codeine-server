var express = require("express");
var router = express.Router();
const { userAuthMiddleware } = require("../middleware/authMiddleware");

const plausibilityController = require("../controllers/plausibilityController");

router.post("/sendResponse", plausibilityController.sendResponse);

router.get("/getErrorDetailTest/:textId", plausibilityController.getErrorDetailTest);

router.get("/getText", plausibilityController.getText);
 

module.exports = router;
