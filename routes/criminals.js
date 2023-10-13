var express = require("express");
var router = express.Router();
const { Criminal, UserCriminal } = require("../models");
// const authMiddleware = require("../middleware/authMiddleware");

// router.get("/protected-route", authMiddleware, (req, res) => {
//   // Route protégée par l'authentification
// });

router.get("/:criminalId", async function (req, res) {
  const criminalId = req.params.criminalId;
  try {
    const criminal = await Criminal.findOne({
      where: {
        id: criminalId,
      },
    });
    if (!criminal) {
      return res.status(404).json({ error: "Criminal not found" });
    }
    res.status(200).json(criminal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/caughtByUserId/:userId", async function (req, res) {
  const userId = req.params.userId;
  try {
    const userCriminals = await UserCriminal.findAll({
      where: { user_id: userId },
      include: Criminal,
    });
    const criminals = userCriminals.map((uc) => uc.criminal);
    if (criminals.length === 0) {
      return res.status(404).json({ error: "No criminals found for user" });
    }
    res.status(200).json(criminals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
