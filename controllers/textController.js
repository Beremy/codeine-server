const { Text, Token, UserGameText, Sentence } = require("../models");
const { exec } = require("child_process");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const { getVariableFromCache } = require("../service/cache");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

const getNumberOfTexts = async (req, res) => {
  try {
    const numberOfTexts = await Text.count();
    res.status(200).json({ count: numberOfTexts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSmallTextWithTokens = async (req, res) => {
  try {
    const { gameType } = req.params;

    const nbToken = getVariableFromCache("text_length_in_game") || 110;

    // chercher tous les textes déjà joués par cet utilisateur pour ce type de jeu
    const userGameTexts = await UserGameText.findAll({
      where: {
        // user_id: userId,
        game_type: gameType,
      },
      attributes: ["text_id"],
    });

    // créer un tableau d'IDs de ces textes
    const playedTextIds = userGameTexts.map(
      (userGameText) => userGameText.text_id
    );

    // trouver un texte qui n'a pas encore été joué par cet utilisateur pour ce type de jeu
    let text = await Text.findOne({
      where: {
        id: { [Op.notIn]: playedTextIds },
        is_plausibility_test: false,
        is_hypothesis_specification_test: false,
        is_condition_specification_test: false,
        is_negation_specification_test: false,
        is_active: true,
      },
      attributes: ["id"],
      order: Sequelize.literal("RAND()"),
    });

    if (!text) {
      return res.status(404).json({ error: "No more texts to process" });
    }

    // Récupérer les phrases du texte sélectionné, triées par leur position
    let sentences = await Sentence.findAll({
      where: { text_id: text.id },
      attributes: ["id", "position"],
      order: [["position", "ASC"]],
      include: [
        {
          model: Token,
          attributes: ["id", "content", "position", "is_punctuation"],
          required: true,
        },
      ],
    });

    if (sentences.length === 0) {
      return res
        .status(404)
        .json({ error: "Text " + text.id + " has no sentences" });
    }

    // Calculer le nombre total de tokens pour chaque phrase
    let totalTokensBySentence = sentences.map(
      (sentence) => sentence.tokens.length
    );
    // Calculer le total cumulatif de tokens pour identifier les points de départ possibles
    let cumulativeTokens = totalTokensBySentence.reduce((acc, curr, i) => {
      acc.push((acc[i - 1] || 0) + curr);
      return acc;
    }, []);

    let selectedSentences = [];
    let totalTokens = 0;

    if (cumulativeTokens[cumulativeTokens.length - 1] < nbToken) {
      selectedSentences = [...sentences]; // Utiliser toutes les sentences
      totalTokens = cumulativeTokens[cumulativeTokens.length - 1]; // Total de tokens du texte
    } else {
      // Déterminer le maxStartIndex correctement sans utiliser startIndex dans le calcul
      let validStartIndexes = cumulativeTokens.findIndex(
        (cumulative) => cumulative >= nbToken
      );
      if (validStartIndexes === -1) {
        // Si aucun index valide n'est trouvé
        return res
          .status(404)
          .json({ error: "Cannot find a suitable start position" });
      }

      // Le maxStartIndex est maintenant l'index du dernier élément qui peut servir de point de départ valide
      let maxStartIndex =
        validStartIndexes < sentences.length
          ? validStartIndexes
          : sentences.length - 1;

      let startIndex = Math.floor(Math.random() * (maxStartIndex + 1));
      let startFromEnd = Math.random() < 0.5; // 50% chance de commencer par la fin

      if (startFromEnd) {
        // Sélectionner depuis la fin
        for (
          let i = sentences.length - 1;
          i >= 0 && totalTokens < nbToken;
          i--
        ) {
          selectedSentences.unshift(sentences[i]); // Ajouter au début pour conserver l'ordre
          totalTokens += sentences[i].tokens.length;
          if (totalTokens >= nbToken) break;
        }
      } else {
        // Sélectionner depuis le début (votre logique actuelle)
        for (let i = 0; i < sentences.length && totalTokens < nbToken; i++) {
          selectedSentences.push(sentences[i]);
          totalTokens += sentences[i].tokens.length;
          if (totalTokens >= nbToken) break;
        }
      }
    }

    let groupedTokens = selectedSentences.flatMap((sentence) =>
      sentence.tokens.map((token) => ({
        id: token.id,
        content: token.content,
        position: token.position,
        is_punctuation: token.is_punctuation,
      }))
    );

    // Construire le résultat final
    let result = {
      id: text.id,
      num: text.num,
      origin: text.origin,
      is_plausibility_test: text.is_plausibility_test,
      test_plausibility: text.test_plausibility,
      is_hypothesis_specification_test: text.is_hypothesis_specification_test,
      is_condition_specification_test: text.is_condition_specification_test,
      is_negation_specification_test: text.is_negation_specification_test,
      length: text.length,
      sentence_positions:
        selectedSentences.length === sentences.length
          ? "full"
          : selectedSentences.map((sentence) => sentence.position).join(", "),
      tokens: groupedTokens,
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTexts = async (req, res) => {
  try {
    const texts = await Text.findAll();
    const truncatedTexts = texts.map((text) => {
      const content =
        text.content.length > 180
          ? text.content.substring(0, 180) + "..."
          : text.content;

      return {
        ...text.toJSON(),
        content: content,
        created_at: text.created_at.toISOString().split("T")[0],
      };
    });

    res.status(200).json(truncatedTexts.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTextById = async (req, res) => {
  try {
    const text = await Text.findByPk(req.params.id, {
      attributes: { exclude: ["length"] },
    });
    if (!text) {
      return res.status(404).json({ error: "Text not found" });
    }
    text.dataValues.created_at = moment(text.created_at)
      .locale("fr")
      .format("DD MMMM YYYY");

    res.status(200).json(text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createSeveralTexts = async (req, res) => {
  try {
    console.log("createSeveralTexts started");

    const { texts } = req.body;

    if (!Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ error: "Texts array is required and cannot be empty" });
    }

    // Écrire les textes dans un fichier temporaire
    const tempFilePath = path.join(__dirname, "temp_texts.json");
    fs.writeFileSync(tempFilePath, JSON.stringify(texts));
    console.log("Temporary file created:", tempFilePath);

    const scriptToRun = "./scripts/importSeveralTexts.py";
    const command = `./hostomythoenv/bin/python ${scriptToRun} ${tempFilePath}`;

    // Exécuter le script Python
    console.log("Running Python script...");
    const output = await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Python script error (stderr): ${stderr}`);
          console.error(`Python script error (stdout): ${stdout}`);
          return reject(`Error running script: ${stderr || error.message}`);
        }
        try {
          const parsedOutput = JSON.parse(stdout);
          console.log("Python script output:", parsedOutput);
          resolve(parsedOutput);
        } catch (err) {
          console.error("Invalid JSON from Python script:", stdout);
          reject(`Invalid JSON from script: ${err.message}`);
        }
      });
    });

    console.log("Processing output...");
    const results = [];
    for (const textOutput of output) {
      const { num, origin, result } = textOutput;
      const { tokens, sentences } = result;

      // Récupérez les champs personnalisés pour ce texte
      const originalTextData = texts.find((t) => t.num === num);
      const { content, reason_for_rate, test_plausibility, is_plausibility_test,is_negation_specification_test, is_active } = originalTextData;

      console.log(`Creating text for num: ${num}`);

      const createdText = await Text.create({
        num,
        content,
        origin,
        reason_for_rate: reason_for_rate || null,
        test_plausibility: test_plausibility || "0",
        is_plausibility_test: is_plausibility_test || 0,
        is_negation_specification_test: is_negation_specification_test || 0,
        is_active: is_active || 1,
        length: tokens.length,
      });

      console.log(`Created text: ${createdText.id}`);

      for (const sentenceInfo of sentences) {
        const sentence = await Sentence.create({
          text_id: createdText.id,
          content: sentenceInfo.content,
          position: sentenceInfo.position,
        });

        console.log(`Created sentence: ${sentence.id} for text: ${createdText.id}`);

        const tokensForThisSentence = tokens.filter(
          (t) => t.sentence_position === sentenceInfo.position
        );
        for (const tokenInfo of tokensForThisSentence) {
          await Token.create({
            text_id: createdText.id,
            sentence_id: sentence.id,
            content: tokenInfo.text,
            position: tokenInfo.position,
            is_punctuation: tokenInfo.is_punctuation,
          });
        }
      }

      results.push(createdText);
    }

    console.log("Removing temporary file...");
    // Supprimez le fichier temporaire après traitement
    fs.unlinkSync(tempFilePath);

    console.log("Sending response...");
    res.status(201).json(results);
  } catch (error) {
    console.error(`Error during bulk import: ${error}`);
    res.status(500).json({ error: error.message });
  }
};



const createText = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const scriptToRun = "./scripts/spacyTokenAndSentence.py";

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
            reason_for_rate: req.body.reason_for_rate,
          };

          const text = await Text.create(textData);

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
      attributes: ["id"],
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

module.exports = {
  getAllTexts,
  getTextById,
  createText,
  createSeveralTexts,
  updateText,
  deleteText,
  getTextsByOrigin,
  getSmallTextWithTokens,
  getTextWithTokensById,
  getNumberOfTexts,
};
