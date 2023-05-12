const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { Op } = require("sequelize");

const createUser = async (user) => {
  try {
    user.password = await bcrypt.hash(user.password, 10);
    return await User.create(user);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getUserByUsername = async (username) => {
  return await User.findOne({ where: { username } });
};

const signup = async (req, res) => {
  try {
    const user = await createUser(req.body);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    const userInfo = user.get({ plain: true });
    delete userInfo.password;
    res
      .status(201)
      .json({ message: "User created successfully", token, user: userInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const user = await getUserByUsername(req.body.username);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const userInfo = user.get({ plain: true });
    delete userInfo.password;
    res
      .status(200)
      .json({ message: "User signed in successfully", token, user: userInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsersOrderedByPoints = async (req, res) => {
  const limit = 20; // nombre d'utilisateurs par page
  const page = req.query.page || 1; // page actuelle
  const offset = (page - 1) * limit;
  console.log("test");
  try {
    const users = await User.findAll({
      order: [["points", "DESC"]],
      limit,
      offset,
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir le rang de l'utilisateur et les joueurs proches de lui
const getUserRanking = async (req, res) => {
  const userId = req.params.id; // ID de l'utilisateur connecté

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Obtenir le rang de l'utilisateur
    const rank =
      (await User.count({ where: { points: { [Op.gt]: user.points } } })) + 1;

    let users = [];
    // Obtenir l'utilisateur précédent si ce n'est pas le premier
    if (rank > 1) {
      const previousUser = await User.findOne({
        where: { points: { [Op.lt]: user.points } },
        order: [["points", "DESC"]],
      });
      users.push({ position: rank - 1, user: previousUser });
    }
    delete user.password;

    // Ajouter l'utilisateur connecté
    users.push({ position: rank, user: user });

    // Obtenir l'utilisateur suivant si ce n'est pas le dernier
    const nextUser = await User.findOne({
      where: { points: { [Op.gt]: user.points } },
      order: [["points", "ASC"]],
    });
    if (nextUser) {
      delete nextUser.password;
      users.push({ position: rank + 1, user: nextUser });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signup,
  signin,
  getAllUsers,
  getUserById,
  getUsersOrderedByPoints,
  getUserRanking,
};
