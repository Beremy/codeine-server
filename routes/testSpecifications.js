var express = require("express");
var router = express.Router();
const { adminAuthMiddleware } = require("../middleware/authMiddleware");
const testSpecificationController = require("../controllers/testSpecificationController");

// router.get("/:textId/:type", adminAuthMiddleware, testSpecificationController.getTestSpecificationByTextId);
// router.post("/", adminAuthMiddleware, testSpecificationController.createTestSpecification);
// router.delete("/deleteByTextId/:textId", adminAuthMiddleware, testSpecificationController.deleteTestSpecificationsByTextId);


router.get("/:textId/:type", adminAuthMiddleware, testSpecificationController.getTestSpecificationByTextId);
router.post("/", adminAuthMiddleware, testSpecificationController.createTestSpecifications);
router.delete("/deleteByTextId/:textId", adminAuthMiddleware, testSpecificationController.deleteTestSpecificationsByTextId);

module.exports = router;
