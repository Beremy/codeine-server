var express = require("express");
var router = express.Router();
const { TestPlausibilityError, Text } = require("../models");

router.get("/:textId", async function (req, res, next) {
  const textId = req.params.textId;
  try {
    const plausibilityErrors = await TestPlausibilityError.findAll({
      where: {
        text_id: textId,
      },
    });
    res.status(200).json(plausibilityErrors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/correctPlausibility/:textId", async function (req, res, next) {
  const textId = req.params.textId;
  try {
    const text = await Text.findOne({
      where: {
        id: textId,
      },
    });

    res.status(200).json({ test_plausibility: text.test_plausibility });
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
