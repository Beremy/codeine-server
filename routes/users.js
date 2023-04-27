var express = require("express");
var router = express.Router();
const { User } = require("../models"); // Import your User model

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:userid", async function (req, res, next) {
  var userId = req.params.userid;
  try {
    const user = await User.findByPk(userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

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
