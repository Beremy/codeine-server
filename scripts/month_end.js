
const { Sequelize, QueryTypes } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    timezone: "+01:00",
    define: {
      timestamps: false,
      freezeTableName: true,
    },
  }
);

const UserAchievement = sequelize.define('UserAchievement', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  achievement_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  notified: DataTypes.INTEGER
}, {
  tableName: 'user_achievement'
});

const logToFile = (message) => {
  console.log(message);
};

async function addAchievementIfNotExists(userId, achievementId) {
  const [userAchievement, created] = await UserAchievement.findOrCreate({
    where: { user_id: userId, achievement_id: achievementId },
    defaults: {
      user_id: userId,
      achievement_id: achievementId,
      notified: 0
    }
  });
  if (created) {
    logToFile(`Haut fait id ${achievementId} attribué à l'utilisateur ${userId}`);
  } else {
    logToFile(`L'utilisateur ${userId} a déjà le haut fait id ${achievementId}`);
  }
}

const resetMonthlyPoints = async () => {
  logToFile("");
  logToFile("***************************");
  logToFile(`Script exécuté le : ${new Date().toISOString()}`);
  try {
    await sequelize.authenticate();
    logToFile("Connexion à la bdd réussie");

    await sequelize.query("DELETE FROM monthly_winners", { type: QueryTypes.DELETE });

    const winners = await sequelize.query(
      "SELECT id, username, monthly_points FROM users ORDER BY monthly_points DESC LIMIT 3",
      { type: QueryTypes.SELECT }
    );
    logToFile("Gagnants de ce mois");
    for (const winner of winners) {
      logToFile(`${winner.id} - ${winner.username} - ${winner.monthly_points}`);

      await sequelize.query(
        "INSERT INTO monthly_winners (user_id, username, points, ranking) VALUES (?, ?, ?, ?)",
        { replacements: [winner.id, winner.username, winner.monthly_points, winners.indexOf(winner) + 1], type: QueryTypes.INSERT }
      );

      await addAchievementIfNotExists(winner.id, 22); // Adding achievement 22

      if (winners.indexOf(winner) === 0) {
        await sequelize.query(
          "UPDATE users SET nb_first_monthly = nb_first_monthly + 1 WHERE id = ?",
          { replacements: [winner.id], type: QueryTypes.UPDATE }
        );
        logToFile(`nb_first_monthly incrémenté pour l'utilisateur ${winner.id}`);

        await addAchievementIfNotExists(winner.id, 23); // Adding achievement 23 for the first place only
      }
    }

    await sequelize.query("UPDATE users SET monthly_points = 0", { type: QueryTypes.UPDATE });
    logToFile("Points mensuels réinitialisés.");
  } catch (error) {
    logToFile(`Erreur pendant la réinitialisation des points mensuels : ${error.message}`);
  } finally {
    await sequelize.close();
  }
};

resetMonthlyPoints();
