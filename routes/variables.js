var express = require("express");
var router = express.Router();
const variablesController = require("../controllers/variablesController.js");

const { adminAuthMiddleware } = require("../middleware/authMiddleware");

router.get("/", adminAuthMiddleware, variablesController.getAllVariables);
router.put("/updateVariables/", adminAuthMiddleware, variablesController.updateVariables);
router.get("/:key", adminAuthMiddleware, variablesController.getVariableByKey);

module.exports = router;
