var express = require("express");
var router = express.Router();
const { TestSpecification } = require("../models");

router.get("/:textId/:type", async function (req, res, next) {
  
  const textId = req.params.textId;
  const type = req.params.type;
  try {
    const userGameTexts = await TestSpecification.findAll({
      where: {
        text_id: textId,
        type: type,
      },
    });
    res.status(200).json(userGameTexts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async function (req, res, next) {
  try {
    const newUTestSpecification = await TestSpecification.create(req.body);
    res.status(201).json(newUTestSpecification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
