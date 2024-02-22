const { PasswordResetToken } = require('../models');
const { Op } = require('sequelize');

async function cleanExpiredTokens() {
  try {
    const now = new Date();
    await PasswordResetToken.destroy({
      where: {
        expires: {
          [Op.lt]: now 
        }
      }
    });
    console.log("Nettoyage des tokens expirés effectué");
  } catch (error) {
    console.error("Erreur lors du nettoyage des tokens expirés:", error);
  }
}

module.exports = { cleanExpiredTokens };
