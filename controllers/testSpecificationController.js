const { TestSpecification } = require("../models");


const createTestSpecification = async (req, res) => {
  try {
    const newUTestSpecification = await TestSpecification.create(req.body);
    res.status(201).json(newUTestSpecification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTestSpecificationByTextId = async (req, res) => {
    console.log("getTest");
  try {
    const textId = parseInt(req.params.textId);
    const type = req.params.type;
    console.log(textId);
    console.log(type);
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
    //   else {
    //     res.status(404).send("No TestSpecifications found for the text");
    //   }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports = {
  getTestSpecificationByTextId,
  createTestSpecification,
  deleteTestSpecificationsByTextId
};
