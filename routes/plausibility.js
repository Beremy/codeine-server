var express = require("express");
var router = express.Router();
const { Text, UserErrorDetail } = require("../models");
const { Op } = require("sequelize");

router.get("/getErrorDetailTest/:textId", async function (req, res, next) {
    const textId = req.params.textId;
  
    try {
      const plausibilityErrors = await UserErrorDetail.findAll({
        where: {
          text_id: textId,
          is_test: true,
          test_error_type_id: {
            [Op.ne]: 10 // Enlever les erreurs qui sont typées "non erreur"
          }
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
    const newPlausibilityError = await UserErrorDetail.create(req.body);
    res.status(201).json(newPlausibilityError);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getReasonForRateByTextId/:textId", async function (req, res, next) {
  const textId = req.params.textId;
  try {
    const text = await Text.findOne({
      where: {
        id: textId,
      },
    });

    res.status(200).json({ reason_for_rate: text.reason_for_rate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
