var express = require("express");
var router = express.Router();
const { ErrorType, UserErrorDetail, UserTypingErrors } = require("../models");

router.post("/createUserTypingError", async (req, res) => {
  const { user_id, user_error_details_id, error_type_id, sentence_positions } = req.body;

  try {
    const newUserTypingError = await UserTypingErrors.create({
      user_id: user_id,
      user_error_details_id: user_error_details_id,
      error_type_id: error_type_id,
    });

    const userErrorDetail = await UserErrorDetail.findOne({
      where: { id: user_error_details_id },
    });

    if (userErrorDetail) {
      let newVoteWeight = userErrorDetail.vote_weight;

      if (error_type_id === 10) {
        newVoteWeight = Math.max(userErrorDetail.vote_weight - 5, 0);
      } else {
        newVoteWeight = userErrorDetail.vote_weight + 3;
      }

      await userErrorDetail.update({ vote_weight: newVoteWeight });
    }

    res.status(201).json(newUserTypingError);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

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
          as: "error_type",
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
