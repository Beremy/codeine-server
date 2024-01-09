var express = require("express");
var router = express.Router();
const { ErrorType, UserErrorDetail } = require("../models");

const errorController = require("../controllers/errorController");

// TODO Créer fonction typing error, avec - weight quand pas erreur


router.get("/getTypesError", async function (req, res, next) {
  try {
    const errorType = await ErrorType.findAll();
    res.status(200).json(errorType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getTypeByErrorId/:userErrorDetailId", async (req, res) => {
  const { userErrorDetailId } = req.params;
  try {
    const userErrorDetail = await UserErrorDetail.findOne({
      where: {
        id: userErrorDetailId,
      },
      include: [
        {
          model: ErrorType,
          attributes: ["id", "name"],
          as: 'error_type'
        },
      ],
    });

    if (userErrorDetail && userErrorDetail.error_type) {
      const errorTypeData = userErrorDetail.error_type;
      res.status(200).json(errorTypeData);
    } else {
      res.status(404).json({ message: "Error not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/isErrorTest/:userErrorDetailId", async (req, res) => {
  const { userErrorDetailId } = req.params;
  try {
    const userErrorDetail = await UserErrorDetail.findOne({
      where: {
        id: userErrorDetailId,
      },
      attributes: ["is_test"],
    });

    if (userErrorDetail) {
      res.status(200).json({ isTest: userErrorDetail.is_test });
    } else {
      res.status(404).json({ message: "Error not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
