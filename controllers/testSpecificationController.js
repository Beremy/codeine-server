const { TestSpecification } = require("../models");

const createTestSpecifications = async (req, res) => {
  try {
    const testSpecifications = req.body;

    // Utilisation de bulkCreate pour insérer plusieurs enregistrements en une fois
    const newTestSpecifications = await TestSpecification.bulkCreate(
      testSpecifications
    );

    res.status(201).json(newTestSpecifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTestSpecificationByTextId = async (req, res) => {
  try {
    const textId = parseInt(req.params.textId);
    const type = req.params.type;
    const userGameTexts = await TestSpecification.findAll({
      where: {
        text_id: textId,
        type: type,
      },
    });
    res.status(200).json(userGameTexts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTestSpecificationsByTextId = async (req, res) => {
  try {
    const textId = parseInt(req.params.textId);
    const deleted = await TestSpecification.destroy({
      where: { text_id: textId },
    });

    if (deleted) {
      res.status(204).send("TestSpecifications supprimées pou ce texte");
    } else {
      res.status(201).send("Pas de TestSpecifications trouvées pour ce texte");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTestSpecificationByTextId,
  createTestSpecifications,
  deleteTestSpecificationsByTextId,
};
