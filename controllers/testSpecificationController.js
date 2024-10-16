const { TestSpecification } = require("../models");

const createTestSpecifications = async (req, res) => {
  try {
    // Attendre un tableau d'objets spécifications dans req.body
    const testSpecifications = req.body;

    // Utiliser bulkCreate pour insérer plusieurs enregistrements en une fois
    const newTestSpecifications = await TestSpecification.bulkCreate(testSpecifications);

    res.status(201).json(newTestSpecifications); // Retourner toutes les spécifications créées
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
        where: { text_id: textId }
      });
  
      if (deleted) {
        res.status(204).send("All TestSpecifications for the text have been deleted");
      } 
      else {
        res.status(201).send("No TestSpecifications found for the text");
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports = {
  getTestSpecificationByTextId,
  createTestSpecifications,
  deleteTestSpecificationsByTextId
};
