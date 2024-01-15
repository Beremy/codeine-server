const {
  Text,
  Theme,
  Token,
  UserGameText,
  TestPlausibilityError,
  Sentence
} = require("../models");
const { exec } = require("child_process");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const getTextWithTokensNotPlayed = async (req, res) => {
  try {
    const { userId, gameType } = req.params;
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
        "num",
        "id_theme",
        "origin",
        "is_plausibility_test",
        "test_plausibility",
        "is_hypothesis_specification_test",
        "is_condition_specification_test",
        "is_negation_specification_test",
        "length",
      ],
      order: Sequelize.literal("RAND()"),
      include: [
        {
          model: Token,
          attributes: ["id", "content", "position", "is_punctuation"],
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

const getTextWithTokensByGameType = async (req, res) => {
  try {
    const text = await Text.findOne({
      attributes: [
        "id",
        "num",
        "id_theme",
        "origin",
        "is_plausibility_test",
        "test_plausibility",
        "is_hypothesis_specification_test",
        "is_condition_specification_test",
        "is_negation_specification_test",
        "length",
      ],
      order: Sequelize.literal("RAND()"),
      include: [
        {
          model: Token,
          attributes: ["id", "content", "position", "is_punctuation"],
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
    const { content, includeSentences } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const scriptToRun = includeSentences
      ? "./scripts/spacyTokenAndSentence.py"
      : "./scripts/spacyToken.py";

    exec(
      `./hostomythoenv/bin/python ${scriptToRun} "${content}"`,
      async (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).json({ error: error.message });
        }

        try {
          const output = JSON.parse(stdout);
          const tokensInfoArray = output.tokens;
          const textData = {
            num: req.body.num,
            content: req.body.content,
            length: tokensInfoArray.length,
            origin: req.body.origin,
            is_plausibility_test: req.body.is_plausibility_test || false,
            test_plausibility: req.body.is_plausibility_test
              ? req.body.test_plausibility
              : 0,
            is_hypothesis_specification_test:
              req.body.is_hypothesis_specification_test || false,
            is_condition_specification_test:
              req.body.is_condition_specification_test || false,
            is_negation_specification_test:
              req.body.is_negation_specification_test || false,
          };

          const text = await Text.create(textData);

          if (includeSentences) {
            const sentencesInfoArray = output.sentences;
            for (let i = 0; i < sentencesInfoArray.length; i++) {
              const sentenceInfo = sentencesInfoArray[i];
              const sentence = await Sentence.create({
                text_id: text.id,
                content: sentenceInfo.content,
                position: sentenceInfo.position,
              });

              // Insérer les tokens associés à cette phrase
              const tokensForThisSentence = tokensInfoArray.filter(
                (t) => t.sentence_position === sentenceInfo.position
              );
              for (const tokenInfo of tokensForThisSentence) {
                await Token.create({
                  text_id: text.id,
                  sentence_id: sentence.id,
                  content: tokenInfo.text,
                  position: tokenInfo.position,
                  is_punctuation: tokenInfo.is_punctuation,
                });
              }
            }
          } else {
            // Insérer les tokens sans sentences
            for (const tokenInfo of tokensInfoArray) {
              await Token.create({
                text_id: text.id,
                content: tokenInfo.text,
                position: tokenInfo.position,
                is_punctuation: tokenInfo.is_punctuation,
                sentence_id: null, // Aucune sentence associée
              });
            }
          }
          if (req.body.is_plausibility_test && req.body.errors) {
            for (const error of req.body.errors) {
              await TestPlausibilityError.create({
                text_id: text.id,
                content: error.content,
                word_positions: error.word_positions,
              });
            }
          }

          res.status(201).json(text);
        } catch (innerError) {
          console.error(`Database or data error: ${innerError}`);
          res.status(500).json({ error: innerError.message });
        }
      }
    );
  } catch (outerError) {
    console.error(`Outer error: ${outerError}`);
    res.status(500).json({ error: outerError.message });
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

const getTextWithTokensById = async (req, res) => {
  try {
    const { textId } = req.params;

    const text = await Text.findOne({
      where: {
        id: textId,
      },
      attributes: [
        "id",
        "num",
        "origin",
        "id_theme",
        "is_plausibility_test",
        "test_plausibility",
        "is_hypothesis_specification_test",
        "is_condition_specification_test",
        "is_negation_specification_test",
      ],
      include: [
        {
          model: Token,
          attributes: ["id", "content", "position", "is_punctuation"],
        },
      ],
    });

    if (!text) {
      return res.status(404).json({ error: "Text not found" });
    }

    // Trier les tokens par leur position
    text.tokens.sort((a, b) => a.position - b.position);

    res.status(200).json(text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTextTestPlausibility = async (req, res) => {
  try {
    // trouver un texte qui a le champ is_plausibility_test à true
    const text = await Text.findOne({
      where: {
        is_plausibility_test: true,
      },
      attributes: ["id", "num", "origin", "is_plausibility_test"],
      order: Sequelize.literal("RAND()"),
      include: [
        {
          model: Token,
          attributes: ["id", "content", "position", "is_punctuation"],
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

const getTextTestNegation = async (req, res) => {
  try {
    // trouver un texte qui a le champ is_negation_specification à true
    const text = await Text.findOne({
      where: {
        is_negation_specification_test: true,
      },
      attributes: ["id", "num", "origin", "is_negation_specification_test"],
      order: Sequelize.literal("RAND()"),
      include: [
        {
          model: Token,
          attributes: ["id", "content", "position", "is_punctuation"],
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

module.exports = {
  getAllTexts,
  getTextById,
  getTextsByTheme,
  createText,
  updateText,
  deleteText,
  getTextsByOrigin,
  getTextWithTokensNotPlayed,
  getTextWithTokensById,
  getTextTestPlausibility,
  getTextTestNegation,
  getTextWithTokensByGameType,
};
