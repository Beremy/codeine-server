const {
  Text,
  Theme,
  Token,
  UserGameText,
  TestPlausibilityError,
  ErrorAggregation,
  UserPlayedErrors,
} = require("../models");
const { exec } = require("child_process");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const getTextWithTokens = async (req, res) => {
  try {
    // récupérer l'id de l'utilisateur et le type de jeu du corps de la requête ou de l'URL
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
        "id_theme",
        "is_plausibility_test",
        "test_plausibility",
        "is_hypothesis_specification_test",
        "is_condition_specification_test",
        "is_negation_specification_test",
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
  // TODO Gérer les sauts de lignes
  try {
    exec(
      `./hostomythoenv/bin/python ./scripts/spacyToken.py "${req.body.content}"`,
      async (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).json({ error: error.message });
        }

        try {
          const tokensInfoArray = JSON.parse(stdout); // Récupérer les informations sur les tokens, y compris les ponctuations

          const textData = {
            content: req.body.content,
            origin: req.body.origin,
            is_plausibility_test: req.body.is_plausibility_test || false,
            test_plausibility: req.body.is_plausibility_test
              ? req.body.test_plausibility
              : null,
            is_hypothesis_specification_test:
              req.body.is_hypothesis_specification_test || false,
            is_condition_specification_test:
              req.body.is_condition_specification_test || false,
            is_negation_specification_test:
              req.body.is_negation_specification_test || false,
          };

          const text = await Text.create(textData);

          for (let i = 0; i < tokensInfoArray.length; i++) {
            const tokenInfo = tokensInfoArray[i];

            // Créer une entrée dans la base de données pour chaque token avec ses informations
            await Token.create({
              text_id: text.id,
              content: tokenInfo.text,
              position: i + 1,
              is_punctuation: tokenInfo.is_punctuation, // Ajouter l'indicateur si le token est une ponctuation
            });
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
    // récupérer l'id du texte depuis le corps de la requête ou de l'URL
    const { textId } = req.params;

    // trouver le texte correspondant à cet ID
    const text = await Text.findOne({
      where: {
        id: textId,
      },
      attributes: [
        "id",
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

    // Vérifier si le texte a été trouvé
    if (!text) {
      return res.status(404).json({ error: "Text not found" });
    }

    // Trier les tokens par leur position
    text.tokens.sort((a, b) => a.position - b.position);

    // Renvoyer le texte trouvé et ses tokens
    res.status(200).json(text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTextWithErrorValidated = async (req, res) => {
  try {
    const { userId } = req.params;

    // D'abord, obtenir tous les ID d'erreurs agrégées jouées par l'utilisateur
    const playedErrors = await UserPlayedErrors.findAll({
      where: { user_id: userId },
      attributes: ["error_aggregation_id"],
    });

    const playedErrorIds = playedErrors.map(
      (error) => error.error_aggregation_id
    );

    // Ensuite, recherche d'une erreur agrégée qui n'a pas été jouée par l'utilisateur et qui a un total_weight supérieur à 50
    const errorAggregation = await ErrorAggregation.findOne({
      where: {
        total_weight: { [Op.gte]: 50 },
        id: { [Op.notIn]: playedErrorIds }, // cela exclut les erreurs déjà jouées
      },
      include: {
        model: Text,
        include: [
          {
            model: Token,
            attributes: ["id", "content", "position", "is_punctuation"],
          },
        ],
      },
      order: Sequelize.literal("RAND()"),
    });

    if (!errorAggregation) {
      return res
        .status(404)
        .json({ error: "No text with unplayed errors found" });
    }

    errorAggregation.text.tokens.sort((a, b) => a.position - b.position);

    // Renvoyer le texte avec une erreur validée
    res.status(200).json({
      id: errorAggregation.text.id,
      tokens: errorAggregation.text.tokens,
      positionErrorTokens: errorAggregation.word_positions,
    });
  } catch (error) {
    console.log(error);
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
  getTextWithTokensById,
  getTextWithErrorValidated,
};
