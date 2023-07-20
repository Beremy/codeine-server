const { Text, Theme } = require("../models");

const getAllTexts = async (req, res) => {
  try {
    const texts = await Text.findAll();
    res.status(200).json(texts.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTextById = async (req, res) => {
  try {
    const text = await Text.findByPk(req.params.id);
    if (!text) {
      return res.status(404).json({ error: "Text not found" });
    }
    res.status(200).json(text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTextsByTheme = async (req, res) => {
  try {
    const themeId = req.params.theme;
    const theme = await Theme.findOne({ where: { id: themeId } });

    if (!theme) {
      return res.status(404).json({ error: "Theme not found" });
    }

    const texts = await Text.findAll({ where: { id_theme: theme.id } });
    res.status(200).json(texts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createText = async (req, res) => {
  try {
    // Standardisation des apostrophes dans le contenu du texte
    req.body.content = req.body.content.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");
    const text = await Text.create(req.body);
    res.status(201).json(text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateText = async (req, res) => {
  const textId = req.params.id;
  try {
    await Text.update(req.body, {
      where: {
        id: textId,
      },
    });
    res.status(200).send("Text updated");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteText = async (req, res) => {
  // TODO Vérifier les id et que les réponses enregistrées poitent vers le bon id, ou sont supprimées
  const textId = req.params.id;
  try {
    await Text.destroy({
      where: {
        id: textId,
      },
    });
    res.status(200).send("Text deleted");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTextsByOrigin = async (req, res) => {
  try {
    const origin = req.params.origin;
    const texts = await Text.findAll({ where: { origin } });
    res.status(200).json(texts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTexts,
  getTextById,
  getTextsByTheme,
  createText,
  updateText,
  deleteText,
  getTextsByOrigin,
};
