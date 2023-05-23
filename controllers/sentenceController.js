const { Sentence } = require("../models");
const { Op, Sequelize } = require("sequelize");

const getAllSentences = async (req, res) => {
  try {
    const sentences = await Sentence.findAll();
    res.status(200).json(sentences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSentenceById = async (req, res) => {
  try {
    const sentence = await Sentence.findByPk(req.params.id);
    if (!sentence) {
      return res.status(404).json({ error: "Sentence not found" });
    }
    res.status(200).json(sentence);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRandomSentences = async (req, res) => {
  const amount = req.params.amount;
  try {
    const sentences = await Sentence.findAll({
      order: Sequelize.literal("rand()"),
      limit: amount
    });
    res.status(200).json(sentences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSentences,
  getSentenceById,
  getRandomSentences
};
