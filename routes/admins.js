var express = require("express");
var router = express.Router();
const { Admin } = require("../models"); 
const authMiddleware = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

router.get("/protected-route", authMiddleware, (req, res) => {
  // Route protégée par l'authentification
});

router.get("/", adminController.getAllAdmins);
router.post("/signup", adminController.signup);
router.post("/signin", adminController.signin);
router.get("/:id", adminController.getAdminById);

router.post("/", async function (req, res, next) {
  try {
    const newAdmin = await Admin.create(req.body);
    res.json(newAdmin);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async function (req, res, next) {
  const adminId = req.params.id;
  try {
    await Admin.update(req.body, {
      where: {
        id: adminId,
      },
    });
    res.status(200).send("Admin updated");
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async function (req, res, next) {
  const adminId = req.params.id;
  try {
    await Admin.destroy({
      where: {
        id: adminId,
      },
    });
    res.status(200).send("Admin deleted");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
