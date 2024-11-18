const { Variable } = require("../models");

let variableCache = {};

// Charger les variables depuis la base de données
const loadVariableCache = async () => {
  const variables = await Variable.findAll();
  variableCache = variables.reduce((acc, variable) => {
    acc[variable.key] = variable.value;
    return acc;
  }, {});
};

// Rafraîchir une variable spécifique dans le cache après modification
const refreshVariableInCache = async (key, value = null) => {
  
    // Si la valeur est passée, l'utiliser directement
    if (value !== null) {
      variableCache[key] = value;
      return;
    }
  
    // Sinon, récupérer la valeur depuis la base de données
    const variable = await Variable.findOne({ where: { key } });
    if (variable) {
      variableCache[key] = variable.value;
    }
  };
  

// Accéder à une variable du cache
const getVariableFromCache = (key) => {
  return variableCache[key];
};

// Initialisation le cache lors du démarrage du serveur
const initializeCache = async () => {
  await loadVariableCache();
};

module.exports = {
  initializeCache,
  getVariableFromCache,
  refreshVariableInCache,
};
