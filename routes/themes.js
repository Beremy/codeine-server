var express = require("express");
var router = express.Router();
const { Theme } = require("../models");

router.get("/", async function (req, res, next) {
  try {
    const themes = await Theme.findAll();
    res.status(200).json(themes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;