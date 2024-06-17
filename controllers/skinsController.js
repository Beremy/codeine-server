const { Skin, User, UserSkin } = require("../models");

const getRandomSkin = async (userId, transaction) => {
  try {
    // Chercher tous les skins disponibles
    const allSkins = await Skin.findAll({ transaction: transaction });

    // Trouver les informations de l'utilisateur
    const user = await User.findByPk(userId, { transaction: transaction });
    if (!user) {
      throw new Error("User not found");
    }

    // Trouver les skins déjà possédés par l'utilisateur
    const ownedSkins = await UserSkin.findAll({
      where: { user_id: userId },
      transaction: transaction,
    });
    const ownedSkinIds = ownedSkins.map((skin) => skin.skin_id);

    // Filtrer pour obtenir les skins non possédés correspondant au genre de l'utilisateur
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

    // S'il n'y a plus de skins à attribuer, retourner que tous les skins sont débloqués
    if (skinPool.length === 0) {
      return { allSkinsUnlocked: true };
    }

    // Sélectionner un skin aléatoirement parmi le pool filtré
    const randomIndex = Math.floor(Math.random() * skinPool.length);
    const selectedSkin = skinPool[randomIndex];

    // Créer une nouvelle entrée pour indiquer que l'utilisateur possède maintenant ce skin
    const newSkin = await UserSkin.create(
      {
        user_id: userId,
        skin_id: selectedSkin.id,
        equipped: false,
      },
      { transaction: transaction }
    );

    // Retourner les détails du skin sélectionné
    return {
      skin_id: selectedSkin.id,
      name: selectedSkin.name,
      image_url: selectedSkin.image_url,
      type: selectedSkin.type,
      rarity: selectedSkin.rarity,
    };
  } catch (error) {
    console.error("Error getting random skin:", error.message);
    throw new Error("Error getting random skin: " + error.message);
  }
};

module.exports = {
  getRandomSkin,
};
