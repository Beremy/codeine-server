const { createConnection } = require("mysql2");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const connection = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const backupDir = path.join(__dirname, "../backups");
const backupRetentionDays = 31;

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`Dossier de backup créé : ${backupDir}`);
}

const logToFile = (message) => {
  console.log(message);
};

const performBackup = () => {
  const date = new Date();
  const dateString = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
  const backupFile = path.join(
    backupDir,
    `${process.env.DB_NAME}-${dateString}.sql`
  );

  const backupCommand = `mysqldump -h ${process.env.DB_HOST} -u ${process.env.DB_USER} --password=${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${backupFile}`;

  exec(backupCommand, (error, stdout, stderr) => {
    if (error) {
      logToFile(`Erreur lors du backup de la base de données: ${error}`);
      return;
    }
    logToFile(`Backup réalisé avec succès : ${backupFile}`);
    cleanOldBackups(() => {
      // Fermer la connexion après la fin du nettoyage
      connection.end((err) => {
        if (err) {
          logToFile(
            `Erreur lors de la fermeture de la connexion MySQL: ${err}`
          );
        }
      });
    });
  });
};

const cleanOldBackups = (callback) => {
  fs.readdir(backupDir, (err, files) => {
    if (err) {
      logToFile(`Erreur lors de la lecture du dossier de backups: ${err}`);
      return callback();
    }
    const cleanupActions = files.map((file) => {
      return new Promise((resolve, reject) => {
        const filePath = path.join(backupDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            logToFile(`Impossible de récupérer les infos du fichier: ${err}`);
            return resolve();
          }
          const now = new Date().getTime();
          const fileTime = new Date(stats.mtime).getTime();
          const endTime = fileTime + backupRetentionDays * 24 * 60 * 60 * 1000;
          if (now > endTime) {
            fs.unlink(filePath, (err) => {
              if (err) {
                logToFile(
                  `Erreur lors de la suppression du fichier backup: ${err}`
                );
                return resolve();
              }
              logToFile(`Fichier backup supprimé : ${filePath}`);
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
    });

    Promise.all(cleanupActions).then(() => {
      callback();
    });
  });
};

performBackup();
