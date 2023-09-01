var express = require("express");
var router = express.Router();
const { TestPlausibilityError } = require("../models");

router.get("/:textId/:type", async function (req, res, next) {
  const textId = req.params.textId;
  const type = req.params.type;

  try {
    const plausibilityErrors = await TestPlausibilityError.findAll({
      where: {
        text_id: textId,
        type: type,
      },
    });
    res.status(200).json(plausibilityErrors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async function (req, res, next) {
  try {
    const newPlausibilityError = await TestPlausibilityError.create(req.body);
    res.status(201).json(newPlausibilityError);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
