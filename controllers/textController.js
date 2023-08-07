const { Text, Theme, Token, UserGameText } = require("../models");
// TODO Voir si je stocke une liste de position pour les specifications, oue si je crée encore une nouvelle table.

const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const getTextWithTokens = async (req, res) => {
  try {
    // récupérer l'id de l'utilisateur et le type de jeu du corps de la requête ou de l'URL
    const { userId, gameType } = req.body; // ou req.params si vous les transmettez via l'URL
    // chercher tous les textes déjà joués par cet utilisateur pour ce type de jeu
    const userGameTexts = await UserGameText.findAll({
      where: {
        user_id: userId,
        game_type: gameType,
      },
      attributes: ["text_id"],
    });

    // créer un tableau d'IDs de ces textes
    const playedTextIds = userGameTexts.map(
      (userGameText) => userGameText.text_id
    );

    // trouver un texte qui n'a pas encore été joué par cet utilisateur pour ce type de jeu
    const text = await Text.findOne({
      where: {
        id: { [Op.notIn]: playedTextIds },
      },
      attributes: [
        "id",
        "id_theme",
        "is_plausibility_test",
        "test_plausibility",
        "is_specification_test",
      ],
      order: Sequelize.literal("RAND()"),
      include: [
        {
          model: Token,
          attributes: ["id", "content", "position"],
        },
      ],
    });

    if (!text) {
      return res.status(404).json({ error: "No more texts to process" });
    }
    text.tokens.sort((a, b) => a.position - b.position);

    res.status(200).json(text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
    req.body.content = req.body.content.replace(
      /[\u2018\u2019\u201A\u201B\u2032\u2035]/g,
      "'"
    );
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
  getTextWithTokens,
};
