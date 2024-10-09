const { Variable } = require("../models");
const { sequelize } = require("../service/db.js");

const getAllVariables = async (req, res) => {
  try {
    const variables = await Variable.findAll();
    res.status(200).json(variables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVariableByKey = async (req, res) => {
    try {
      const { key } = req.params;
      const variable = await Variable.findOne({ where: { key } });
  
      if (!variable) {
        return res.status(404).json({ error: "Variable not found" });
      }
  
      res.status(200).json({ value: variable.value });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const updateVariables = async (req, res) => {
    const transaction = await sequelize.transaction();
  
    try {
      const { variables } = req.body;
  
      if (!variables || Object.keys(variables).length === 0) {
        return res.status(400).json({ error: "No variables provided to update" });
      }
  
      for (const [key, newValue] of Object.entries(variables)) {
        const variable = await Variable.findOne({ where: { key }, transaction });
  
        if (!variable) {
          return res
            .status(404)
            .json({ error: `Variable with key '${key}' not found` });
        }
  
        variable.value = newValue;
        await variable.save({ transaction });
      }
  
      await transaction.commit();
      res.status(200).json({ message: "Variables updated successfully" });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  getAllVariables,
  getVariableByKey,
  updateVariables,
};
