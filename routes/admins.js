var express = require("express");
var router = express.Router();
const { Admin } = require("../models"); 
const authMiddleware = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

router.get("/protected-route", authMiddleware, (req, res) => {
  // Route protégée par l'authentification
});

module.exports = router;
