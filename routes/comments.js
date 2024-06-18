var express = require("express");
var router = express.Router();
const { UserCommentVotes } = require("../models");
const { authMiddleware } = require("../middleware/authMiddleware");

const voteComment = async (req, res) => {
  // TODO A voir si je mets l'userId dans l'url ou dans le token
  const userId = req.user.id;
  const { commentId, voteType } = req.body;

  try {
    // Vérification si le vote existe déjà pour ce commentaire et cet utilisateur
    const existingVote = await UserCommentVotes.findOne({
      where: {
        user_id: userId,
        comment_id: commentId,
      },
    });

    if (existingVote) {
      // Si un vote existe déjà, mettre à jour le type de vote
      await existingVote.update({ vote_type: voteType });
    } else {
      // Sinon, créer un nouveau vote
      await UserCommentVotes.create({
        user_id: userId,
        comment_id: commentId,
        vote_type: voteType,
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Votre vote a été enregistré." });
  } catch (error) {
    console.error("Erreur pendant le vote:", error);
    res.status(500).json({ error: error.message });
  }
};

router.post("/voteComment", authMiddleware, voteComment);

module.exports = router;
