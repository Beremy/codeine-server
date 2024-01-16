const { Sequelize, QueryTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    timezone: '+01:00',
    define: {
      timestamps: false,
      freezeTableName: true,
    },
  }
);

const logToFile = (message) => {
  // const logFile = path.join(__dirname, "month_end.log");
  // const frTime = new Date().toLocaleString("fr-FR", {
  //   timeZone: "Europe/Paris",
  // });
  // fs.appendFileSync(logFile, `${frTime} - ${message}\n`);
};

const resetMonthlyPoints = async () => {
  logToFile("");
  logToFile("***************************");
  try {
    await sequelize.authenticate();
    logToFile("Connexion à la bdd réussie");

    // Vide la table monthly_winners avant d'insérer les nouveaux gagnants
    await sequelize.query("DELETE FROM monthly_winners", {
      type: QueryTypes.DELETE,
    });

    // Sélectionner les trois meilleurs utilisateurs
    const winners = await sequelize.query(
      "SELECT id, username, monthly_points FROM users ORDER BY monthly_points DESC LIMIT 3",
      { type: QueryTypes.SELECT }
    );
    logToFile("Gagnants de ce mois");
    for (const winner of winners) {
      logToFile(
        winner.id + " - " + winner.username + " - " + winner.monthly_points
      );

      await sequelize.query(
        "INSERT INTO monthly_winners (user_id, username, points, ranking) VALUES (?, ?, ?, ?)",
        {
          replacements: [
            winner.id,
            winner.username,
            winner.monthly_points,
            winners.indexOf(winner) + 1,
          ],
          type: QueryTypes.INSERT,
        }
      );

      // Incrémente nb_first_monthly pour le gagnant en première position
      if (winners.indexOf(winner) === 0) {
        await sequelize.query(
          "UPDATE users SET nb_first_monthly = nb_first_monthly + 1 WHERE id = ?",
          {
            replacements: [winner.id],
            type: QueryTypes.UPDATE,
          }
        );
        logToFile(
          "nb_first_monthly incrémenté pour l'utilisateur " + winner.id
        );
      }
    }

    // Réinitialise les monthly_points de tous les utilisateurs
    await sequelize.query("UPDATE users SET monthly_points = 0", {
      type: QueryTypes.UPDATE,
    });

    logToFile("Points mensuels réinitialisés.");
  } catch (error) {
    logToFile(
      "Erreur pendant la réinitialisation des points mensuels : " +
        error.message
    );
  } finally {
    await sequelize.close();
  }
};

resetMonthlyPoints();
