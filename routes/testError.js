var express = require("express");
var router = express.Router();
const { adminAuthMiddleware } = require("../middleware/authMiddleware");
const userErrorDetailsController = require("../controllers/testErrorController");

router.get("/byTextId/:textId", userErrorDetailsController.getErrorTestByTextId);
router.get("/:errorId", userErrorDetailsController.getErrorTestById);

// router.get("/:textId", adminAuthMiddleware, userErrorDetailsController.getErrorTestByTextId);
router.get("/", adminAuthMiddleware, userErrorDetailsController.getAllErrorTests);
router.post("/", userErrorDetailsController.createErrorTest);
router.put("/:errorId", adminAuthMiddleware, userErrorDetailsController.updateErrorTestById);
router.delete("/:errorId", adminAuthMiddleware, userErrorDetailsController.deleteErrorTestById);

module.exports = router;
