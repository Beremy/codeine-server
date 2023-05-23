var express = require("express");
var router = express.Router();
const textController = require("../controllers/textController");

router.get("/", textController.getAllTexts);
router.get("/:id", textController.getTextById);
router.get("/theme/:theme", textController.getTextsByTheme);
router.post("/", textController.createText);
router.put("/:id", textController.updateText);
router.delete("/:id", textController.deleteText);

module.exports = router;
