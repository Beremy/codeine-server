const jwt = require("jsonwebtoken");
var express = require("express");
var router = express.Router();
const { MessageMenu, User, PasswordResetToken, Text } = require("../models");
const Mailjet = require("node-mailjet");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../service/db.js");
const { Op } = require("sequelize");
const utilsController = require("../controllers/utilsController.js");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const { adminAuthMiddleware } = require("../middleware/authMiddleware");

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE,
  {
    config: {},
    options: {},
  }
);

router.post("/refreshToken", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ error: "Refresh Token is required" });

  try {
    const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: userData.id, role: userData.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ error: "Invalid or Expired Refresh Token" });
  }
});

// **************** Dump data  ****************
router.post("/dump/tables", adminAuthMiddleware, utilsController.dumpTables);

// **************** Reset password  ****************
const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// TODO Verif du token user
router.post("/requestReset", async (req, res) => {
  try {
    const { email } = req.body;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Adresse email invalide" });
    }
    const user = await User.findOne({ where: { email } });
    if (user) {
      const token = generateResetToken();
      const expires = new Date(Date.now() + 3600000); // 1 heure à partir de maintenant

      await PasswordResetToken.create({
        userId: user.id,
        token: token,
        expires: expires,
      });

      const baseUrl = process.env.APP_BASE_URL || "https://codeine.atilf.fr";
      const resetUrl = `${baseUrl}/NouveauMotDePasse?token=${token}`;
      await sendMail(
        user.email,
        "Réinitialisation de mot de passe",
        `
        Bonjour,

        Nous avons reçu une demande de réinitialisation du mot de passe de votre compte. Si vous avez effectué cette demande, cliquez sur le lien ci-dessous pour modifier votre mot de passe :

        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block;">Réinitialiser le mot de passe</a>

        Le lien est actif pendant 1 heure. Après ce délai, vous devrez refaire une demande de réinitialisation.

        Si vous n'avez pas demandé à réinitialiser votre mot de passe, vous pouvez ignorer ce message.

       HostoMytho`,
        `
        <html>
        <body>
        <div style="font-family: Arial, sans-serif; color: #333333; padding: 20px;">
        <h2 style="color: #4CAF50;">Réinitialisation de Mot de Passe</h2>
        <p>Bonjour,</p>
        <p>Nous avons reçu une demande de réinitialisation du mot de passe de votre compte. Si vous avez effectué cette demande, cliquez sur le bouton ci-dessous pour modifier votre mot de passe :</p>
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; margin: 20px 0;">Réinitialiser le mot de passe</a>
        <p>Ce lien est actif pendant 1 heure. Après ce délai, vous devrez refaire une demande de réinitialisation.</p>
        <p>Si vous n'avez pas demandé à réinitialiser votre mot de passe, vous pouvez ignorer ce message.</p>
        <p>Cordialement,</p>
        <p><strong>HostoMytho</strong></p>
      </div>
      
        </body>
        </html>
        `
      );
    }
    res.status(200).json({
      message:
        "Si votre email est dans notre système, un mail de réinitialisation a été envoyé.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// TODO Verif du token user
router.post("/resetPassword", async (req, res) => {
  const token = req.body.token;
  const newPassword = req.body.newPassword;

  try {
    const transaction = await sequelize.transaction();

    // Verif token
    const resetToken = await PasswordResetToken.findOne({
      where: { token },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return res.status(400).json({ error: "Token invalide ou expiré" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    await User.update(
      { password: hashedPassword },
      {
        where: { id: resetToken.userId },
        transaction,
      }
    );

    // Supprimer le token de réinitialisation
    await PasswordResetToken.destroy({
      where: { id: resetToken.id },
      transaction,
    });

    await transaction.commit();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// TODO Verif du token user
router.post("/changePassword", async (req, res) => {
  const userId = req.body.id;
  const newPassword = req.body.newPassword;
  try {
    const transaction = await sequelize.transaction();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
      { password: hashedPassword },
      {
        where: { id: userId },
        transaction,
      }
    );
    await transaction.commit();
    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

router.get("/tokenValidation/:token", async (req, res) => {
  const token = req.params.token;
  try {
    // Vérifier si le token existe et n'est pas expiré
    const resetToken = await PasswordResetToken.findOne({
      where: {
        token,
        expires: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!resetToken) {
      return res.status(404).json({ message: "Token invalide ou expiré" });
    }

    return res.status(200).json({ message: "Token valide" });
  } catch (error) {
    console.error("Erreur lors de la validation du token:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/messageMenu", async function (req, res, next) {
  try {
    const messageType = req.query.messageType;

    if (
      !messageType ||
      (messageType !== "home_not_connected" && messageType !== "home_connected")
    ) {
      return res
        .status(400)
        .json({ error: "Invalid or missing messageType parameter." });
    }

    const messageMenu = await MessageMenu.findOne({
      where: {
        active: true,
        message_type: messageType,
      },
    });

    if (!messageMenu) {
      return res.status(404).json({ error: "Message not found." });
    }

    res.json(messageMenu);
  } catch (err) {
    next(err);
  }
});

// ******************** Definition ********************************
router.get("/getDefinition", async (req, res) => {
  const word = req.query.word;
  if (!word) {
    return res.status(400).json({ error: "No word provided" });
  }

  const scriptToRun = "./scripts/lemmatize.py";
  const command = `python ${scriptToRun} "${word}"`;

  exec(command, async (error, stdout, stderr) => {
    if (error || stderr) {
      console.error(`exec error: ${error || stderr}`);
      return res.status(500).json({ error: error?.message || stderr });
    }

    const lemma = stdout.trim();

    try {
      const definitions = await fetchDefinition(lemma);
      if (definitions.length !== 0) {
        res.json(definitions);
      } else {
        res.status(404).json({ error: "No definitions found" });
      }
    } catch (err) {
      console.error("Error fetching definitions:", err);
      res.status(500).json({ error: err.message });
    }
  });
});

async function fetchDefinition(lemma) {
  const wikiUrl = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    lemma
  )}`;
  const response = await fetch(wikiUrl);
  const json = await response.json();

  if (json.type === "disambiguation") {
    return getWikipediaDefinitions(lemma);
  } else if (json.type === "standard" && json.extract) {
    return {
      definitions: [
        {
          title: json.title,
          definition: json.extract,
          url: `https://fr.wikipedia.org/wiki/${encodeURIComponent(lemma)}`,
        },
      ],
      result_type: "direct",
    };
  } else {
    return fetchTextSearch(lemma);
  }
}

async function getWikipediaDefinitions(lemma) {
  const encodedLemma = encodeURIComponent(lemma);
  const disambiguationUrl = `https://fr.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodedLemma}&srlimit=2`;
  const disambiguationResponse = await fetch(disambiguationUrl);
  const disambiguationData = await disambiguationResponse.json();

  const pageTitles = disambiguationData.query.search.map((page) => page.title);
  const definitions = [];

  for (const pageTitle of pageTitles) {
    const definitionUrl = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      pageTitle
    )}`;
    const definitionResponse = await fetch(definitionUrl);
    const definitionData = await definitionResponse.json();

    if (definitionData.extract) {
      definitions.push({
        title: pageTitle,
        definition: definitionData.extract,
        url: `https://fr.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`,
      });
    }
  }
  return {
    definitions: definitions,
    result_type: "multiple",
  };
}

async function fetchTextSearch(lemma) {
  const url = `https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
    lemma
  )}&format=json&origin=*`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.query.search.length > 0) {
    const title = data.query.search[0].title;
    const summary = await fetchSummaryFromWikipedia(title);
    return {
      definitions: [summary],
      result_type: "search",
    };
  } else {
    throw new Error("No results found in full text search");
  }
}

async function fetchSummaryFromWikipedia(title) {
  const url = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title
  )}`;
  const response = await fetch(url);
  const json = await response.json();
  if (json.extract) {
    return {
      title: json.title,
      definition: json.extract,
      url: `https://fr.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    };
  } else {
    throw new Error("Summary not found for the provided title");
  }
}

// **************************************************************
// TODO a sécuriser admin
// router.put("/messageMenu", async function (req, res, next) {
//   try {
//     const existingMessageMenu = await MessageMenu.findByPk(1);
//     if (existingMessageMenu) {
//       existingMessageMenu.title = req.body.title;
//       existingMessageMenu.message = req.body.message;
//       existingMessageMenu.active = req.body.active;
//       await existingMessageMenu.save();
//       res.json(existingMessageMenu);
//     } else {
//       res.status(404).send("Message not found");
//     }
//   } catch (err) {
//     next(err);
//   }
// });

async function sendMail(toEmail, subject, textContent, htmlContent) {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "bertrand.remy@inria.fr",
          Name: "HostoMytho",
        },
        To: [
          {
            Email: toEmail,
            Name: "Destinataire",
          },
        ],
        Subject: subject,
        TextPart: textContent,
        HTMLPart: htmlContent,
      },
    ],
  });

  try {
    const result = await request;
    return result.body;
  } catch (err) {
    console.error(err.statusCode);
    throw err;
  }
}

module.exports = router;
