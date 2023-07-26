var express = require("express");
var router = express.Router();
const { Skin, UserSkin } = require("../models");
// const authMiddleware = require("../middleware/authMiddleware");

// router.get("/protected-route", authMiddleware, (req, res) => {
//   // Route protégée par l'authentification
// });

/* GET skins listing. */
router.get("/", async function (req, res, next) {
  try {
      const skins = await Skin.findAll();

      // Organiser les skins par type
      const skinsByType = skins.reduce((result, skin) => {
          if (!result[skin.type]) result[skin.type] = [];
          result[skin.type].push(skin);
          return result;
      }, {});

      res.status(200).json(skinsByType);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


router.get("/byUserId/:userId", async function (req, res, next) {
  try {
      const userId = req.params.userId;
      const userSkins = await UserSkin.findAll({
          where: { user_id: userId },
          include: [
              {
                  model: Skin,
              },
          ],
      });
      const skins = userSkins.map((ua) => ua.skin);

      // Organiser les skins par type
      const skinsByType = skins.reduce((result, skin) => {
          if (!result[skin.type]) result[skin.type] = [];
          result[skin.type].push(skin);
          return result;
      }, {});

      res.status(200).json(skinsByType);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


router.get("/equipped/:userId", async function (req, res, next) {
  try {
      const userId = req.params.userId;
      const userSkins = await UserSkin.findAll({
          where: { user_id: userId, equipped: true },
          include: [
              {
                  model: Skin,
              },
          ],
      });
      const skins = userSkins.map((ua) => ua.skin);

      // Organiser les skins par type
      const skinsByType = skins.reduce((result, skin) => {
          if (!result[skin.type]) result[skin.type] = [];
          result[skin.type].push(skin);
          return result;
      }, {});

      res.status(200).json(skinsByType);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


module.exports = router;