var express = require("express");
var router = express.Router();
const { ErrorType, ErrorAggregation } = require("../models");

router.get("/getTypesError", async function (req, res, next) {
  try {
    const errorType = await ErrorType.findAll();
    res.status(200).json(errorType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getTypeByErrorId/:errorAggregatedId", async (req, res) => {
  const { errorAggregatedId } = req.params;
  try {
    const errorAggregation = await ErrorAggregation.findOne({
      where: {
        id: errorAggregatedId
      },
      include: [{
        model: ErrorType,
        attributes: ['id', 'name']
      }]
    });

    if (errorAggregation) {
      const errorTypeData = errorAggregation.error_type;
      res.status(200).json(errorTypeData);
    } else {
      res.status(404).json({ message: 'Error aggregation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/isErrorTest/:errorAggregatedId", async (req, res) => {
  const { errorAggregatedId } = req.params;
  try {
    const errorAggregation = await ErrorAggregation.findOne({
      where: {
        id: errorAggregatedId
      },
      attributes: ['is_test']
    });

    if (errorAggregation) {
      res.status(200).json({ isTest: errorAggregation.is_test });
    } else {
      res.status(404).json({ message: 'Error aggregation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
