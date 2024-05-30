const {
  Text,
  Token,
  UserErrorDetail,
  UserPlayedErrors,
  UserTextRating,
} = require("../models");
const { exec } = require("child_process");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;


const createUserTextRating = async (req, res) => {
  const { user_id, text_id, plausibility, vote_weight, sentence_positions } =
    req.body;

  try {
    const newUserTextRating = await UserTextRating.create({
      user_id: user_id,
      text_id: text_id,
      plausibility: plausibility,
      vote_weight: vote_weight,
      sentence_positions: sentence_positions,
    });
    res.status(201).json(newUserTextRating);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const createUserErrorDetail = async (req, res) => {
  const { user_id, text_id, word_positions, vote_weight, content } = req.body;

  try {
    const newUserErrorDetail = await UserErrorDetail.create({
      user_id: user_id,
      text_id: text_id,
      word_positions: word_positions,
      vote_weight: vote_weight,
      content: content,
      is_test: false,
      test_error_type_id: null,
    });

    res.status(201).json(newUserErrorDetail);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getTextWithErrorValidatedNotPlayed = async (req, res) => {
  try {
    const { userId } = req.params;

    // Obtenir tous les ID d'erreurs jouées par l'utilisateur
    const playedErrors = await UserPlayedErrors.findAll({
      where: { user_id: userId },
      attributes: ["user_error_details_id"],
    });

    const playedErrorIds = playedErrors.map(
      (error) => error.user_error_details_id
    );

    // Recherche d'une erreur non jouée par l'utilisateur avec vote_weight supérieur à 50
    const userErrorDetail = await UserErrorDetail.findOne({
      where: {
        vote_weight: { [Op.gte]: 50 },
        id: { [Op.notIn]: playedErrorIds },
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

    if (!userErrorDetail) {
      return res
        .status(404)
        .json({ error: "No text with unplayed errors found" });
    }

    userErrorDetail.text.tokens.sort((a, b) => a.position - b.position);

    // Renvoyer le texte avec une erreur non jouée
    res.status(200).json({
      id: userErrorDetail.text.id,
      num: userErrorDetail.text.num,
      vote_weight: userErrorDetail.vote_weight,
      idUserErrorDetail: userErrorDetail.id,
      userIdUserErrorDetail: userErrorDetail.userId,
      positionErrorTokens: userErrorDetail.word_positions,
      tokens: userErrorDetail.text.tokens,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getTextWithErrorValidated = async (req, res) => {
  try {
    // Recherche d'une erreur agrégée qui a un total_weight supérieur à 50
    const userErrorDetail = await UserErrorDetail.findOne({
      where: {
        vote_weight: { [Op.gte]: 50 },
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

    if (!userErrorDetail) {
      return res
        .status(404)
        .json({ error: "No text with validated errors found" });
    }

    userErrorDetail.text.tokens.sort((a, b) => a.position - b.position);

    // Renvoyer le texte avec une erreur validée
    res.status(200).json({
      id: userErrorDetail.text.id,
      num: userErrorDetail.text.num,
      vote_weight: userErrorDetail.vote_weight,
      idUserErrorDetail: userErrorDetail.id,
      userIdUserErrorDetail: userErrorDetail.userId,
      positionErrorTokens: userErrorDetail.word_positions,
      tokens: userErrorDetail.text.tokens,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getTextWithErrorValidatedByErrorId = async (req, res) => {
  const { errorId } = req.params;
  try {
    // Recherche d'une erreur agrégée qui a un total_weight supérieur à 50
    const userErrorDetail = await UserErrorDetail.findOne({
      where: {
        id: errorId,
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

    if (!userErrorDetail) {
      return res
        .status(404)
        .json({ error: "No text with validated errors found" });
    }

    userErrorDetail.text.tokens.sort((a, b) => a.position - b.position);

    // Renvoyer le texte avec une erreur validée
    res.status(200).json({
      id: userErrorDetail.text.id,
      num: userErrorDetail.text.num,
      vote_weight: userErrorDetail.vote_weight,
      idUserErrorDetail: userErrorDetail.id,
      userIdUserErrorDetail: userErrorDetail.userId,
      positionErrorTokens: userErrorDetail.word_positions,
      tokens: userErrorDetail.text.tokens,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getTextTestWithErrorValidated = async (req, res) => {
  try {
    const userErrorDetail = await UserErrorDetail.findOne({
      where: {
        is_test: true,
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

    if (!userErrorDetail) {
      return res.status(404).json({ error: "No text with test errors found" });
    }

    userErrorDetail.text.tokens.sort((a, b) => a.position - b.position);

    res.status(200).json({
      id: userErrorDetail.text.id,
      num: userErrorDetail.text.num,
      idUserErrorDetail: userErrorDetail.id,
      positionErrorTokens: userErrorDetail.word_positions,
      tokens: userErrorDetail.text.tokens,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTextWithErrorValidated,
  getTextWithErrorValidatedNotPlayed,
  getTextTestWithErrorValidated,
  createUserErrorDetail,
  createUserTextRating,
  getTextWithErrorValidatedByErrorId,
};
