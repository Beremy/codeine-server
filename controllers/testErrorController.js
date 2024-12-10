const { UserErrorDetail } = require("../models");
const { sequelize } = require("../service/db.js");

const createErrorTest = async (req, res) => {
  console.log("************ createErrorTest ************");
  const transaction = await sequelize.transaction();
  try {
    const errorTest = req.body;

    console.log("errorTest");
    console.log(errorTest);

    const newErrorTest = await UserErrorDetail.create(
      {
        text_id: errorTest.text_id,
        word_positions: errorTest.word_positions,
        vote_weight: 100,
        content: errorTest.content,
        is_test: true,
        test_error_type_id: errorTest.test_error_type_id,
        reason_for_type: errorTest.reason_for_type,
      },
      { transaction }
    );

    await transaction.commit();
    console.log("Transaction validée");
    return res.status(201).json(newErrorTest);
  } catch (error) {
    console.error("Error in createErrorTest:", error);

    await transaction.rollback();
    console.log("Transaction annulée");

    res.status(500).json({ error: error.message });
  }
};


const getErrorTestByTextId = async (req, res) => {
  console.log("************ getErrorTestByTextId ************");
  console.log("req.params.textId");
  console.log(req.params.textId);

  try {
    const textId = parseInt(req.params.textId);
    const userGameTexts = await UserErrorDetail.findAll({
      where: {
        text_id: textId,
        is_test: true,
      },
    });

    res.status(200).json(userGameTexts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getErrorTestById = async (req, res) => {
  console.log("************ getErrorTestById ************");
  console.log("req.params.errorId");
  console.log(req.params.errorId);

  try {
    const errorId = parseInt(req.params.errorId);
    const userErrorDetail = await UserErrorDetail.findOne({
      where: {
        id: errorId,
      },
    });

    res.status(200).json(userErrorDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllErrorTests = async (req, res) => {
  try {
    const errorTests = await UserErrorDetail.findAll({
      where: { is_test: true },
    });
    res.status(200).json(errorTests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateErrorTestById = async (req, res) => {
  try {
    const errorId = parseInt(req.params.errorId);
    const updatedFields = req.body;

    const [updated] = await UserErrorDetail.update(updatedFields, {
      where: { id: errorId, is_test: true },
    });

    if (updated) {
      const updatedErrorTest = await UserErrorDetail.findByPk(errorId);
      res.status(200).json(updatedErrorTest);
    } else {
      res
        .status(404)
        .json({ error: "ErrorTest introuvable ou non modifiable" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteErrorTestById = async (req, res) => {
  try {
    const errorId = parseInt(req.params.errorId);
    const deleted = await UserErrorDetail.destroy({
      where: { id: errorId },
    });

    if (deleted) {
      res.status(204).send("ErrorTest supprimée");
    } else {
      res.status(404).send("Pas de ErrorTest trouvée");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllErrorTests,
  getErrorTestByTextId,
  createErrorTest,
  updateErrorTestById,
  deleteErrorTestById,
  getErrorTestById
};
