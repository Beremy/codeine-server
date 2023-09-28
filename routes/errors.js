var express = require("express");
var router = express.Router();
const { ErrorType } = require("../models");

router.get("/getTypesError", async function (req, res, next) {
  try {
    const errorType = await ErrorType.findAll();
    res.status(200).json(errorType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
