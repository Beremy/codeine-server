var express = require("express");
var router = express.Router();
const { User } = require("../models"); // Import your User model
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get("/protected-route", authMiddleware, (req, res) => {
  // Route protégée par l'authentification
});

/* GET users listing. */
router.get("/", userController.getAllUsers);

// POST new user (signup)
router.post("/signup", userController.signup);

// POST user login (signin)
router.post("/signin", userController.signin);

router.get("/getUsersOrderedByPoints", userController.getUsersOrderedByPoints);

// Récupération du rang de l'utilisateur
router.get("/getUserRanking/:id", userController.getUserRanking);

// Récupération du rang de l'utilisateur et des joueurs les plus proches de lui au score
router.get("/getUserRankingRange/:id", userController.getUserRankingRange);

// GET user by ID
router.get("/:id", userController.getUserById);

router.post("/", async function (req, res, next) {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async function (req, res, next) {
  const userId = req.params.id;
  try {
    await User.update(req.body, {
      where: {
        id: userId,
      },
    });
    res.status(200).send("User updated");
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async function (req, res, next) {
  const userId = req.params.id;
  try {
    await User.destroy({
      where: {
        id: userId,
      },
    });
    res.status(200).send("User deleted");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
