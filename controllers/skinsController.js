const { Skin, User, UserSkin } = require("../models");

const getRandomSkin = async (userId) => {
  try {
    const allSkins = await Skin.findAll();
    const user = await User.findByPk(userId);
    const ownedSkins = await UserSkin.findAll({ where: { user_id: userId } });
    const ownedSkinIds = ownedSkins.map((s) => s.skin_id);

    if (!user) {
      throw new Error("User not found");
    }

    let skinPool = [];
    const userGender = user.gender;

    for (let skin of allSkins) {
      if (
        !ownedSkinIds.includes(skin.id) &&
        (skin.gender === userGender ||
          skin.gender === "unisexe" ||
          !skin.gender)
      ) {
        skinPool = skinPool.concat(Array(11 - skin.rarity).fill(skin));
      }
    }

    if (skinPool.length === 0) {
      return { allSkinsUnlocked: true };
    }

    const randomIndex = Math.floor(Math.random() * skinPool.length);
    const selectedSkin = skinPool[randomIndex];

    const newSkin = await UserSkin.create({
      user_id: userId,
      skin_id: selectedSkin.id,
      equipped: false,
    });

    return {
      skin_id: selectedSkin.id,
      name: selectedSkin.name,
      image_url: selectedSkin.image_url,
      type: selectedSkin.type,
      rarity: selectedSkin.rarity,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getRandomSkin,
};
