var express = require("express");
var router = express.Router();
const { Skin, UserSkin, User } = require("../models");
const { Op } = require("sequelize");
const skinOrder = [
  "personnage",
  "face",
  "veste",
  "pilosité",
  "chapeau",
  "yeux/nez",
  "lunettes",
];

const organizeSkinsByType = (skins) => {
  return skins.reduce((result, skin) => {
    if (!result[skin.type]) result[skin.type] = [];
    result[skin.type].push(skin);
    return result;
  }, {});
};

/* GET skins listing. */
router.get("/", async function (req, res, next) {
  try {
    const skins = await Skin.findAll();
    const skinsByType = organizeSkinsByType(skins);
    res.status(200).json(skinsByType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/byUserId/:userId", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    // Récupération du genre de l'utilisateur
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userGender = user.gender;

    // Récupération des skins en fonction du genre de l'utilisateur
    const userSkins = await UserSkin.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Skin,
          where: {
            gender: {
              [Op.or]: [userGender, "unisexe"],
            },
          },
        },
      ],
    });
    const skins = userSkins.map((ua) => ua.skin);
    const skinsByType = organizeSkinsByType(skins);
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
    let skins = userSkins.map((ua) => ua.skin);

    // Trier les skins selon l'ordre défini
    skins.sort((a, b) => skinOrder.indexOf(a.type) - skinOrder.indexOf(b.type));

    res.status(200).json(skins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/equip/:userId/:skinId", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const skinId = req.params.skinId;

    // Déséquiper tous les skins du même type
    const skinToEquip = await Skin.findOne({ where: { id: skinId } });
    const userSkins = await UserSkin.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Skin,
          where: { type: skinToEquip.type },
        },
      ],
    });

    for (let userSkin of userSkins) {
      userSkin.equipped = false;
      await userSkin.save();
    }

    // Trouver et équiper le skin spécifié
    const userSkinToEquip = await UserSkin.findOne({
      where: { user_id: userId, skin_id: skinId },
    });

    if (!userSkinToEquip) {
      res.status(404).json({ error: "User or skin not found" });
      return;
    }

    userSkinToEquip.equipped = true;
    await userSkinToEquip.save();

    res.status(200).json(userSkinToEquip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/unequip/:userId/:skinId", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const skinId = req.params.skinId;

    // Trouver et déséquiper le skin spécifié
    const userSkinToUnequip = await UserSkin.findOne({
      where: { user_id: userId, skin_id: skinId },
    });

    if (!userSkinToUnequip) {
      res.status(404).json({ error: "User or skin not found" });
      return;
    }

    userSkinToUnequip.equipped = false;
    await userSkinToUnequip.save();

    res.status(200).json(userSkinToUnequip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
