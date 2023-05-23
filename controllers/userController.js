const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");

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

  try {
    const users = await User.findAll({
      order: [["points", "DESC"]],
      limit,
      offset,
      attributes: { exclude: ["password"] },
    });
    let lastPoints = null;
    let lastRank = 0;
    // Ajouter la position à chaque utilisateur
    const usersWithRank = users.map((user, index) => {
      const userPlain = user.get({ plain: true });

      if (lastPoints !== userPlain.points) {
        lastRank = offset + index + 1;
        lastPoints = userPlain.points;
      }

      return {
        ...userPlain,
        ranking: lastRank,
      };
    });

    res.status(200).json(usersWithRank);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserRanking = async (req, res) => {
  const userId = parseInt(req.params.id); // ID de l'utilisateur

  try {
    const rankings = await User.sequelize.query(
      "SELECT id, username, points, RANK() OVER (ORDER BY points DESC) as ranking FROM users",
      { type: QueryTypes.SELECT }
    );

    const userRanking = rankings.find((ranking) => ranking.id === userId);

    if (!userRanking) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userRanking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserRankingRange = async (req, res) => {
  const userId = parseInt(req.params.id);
  const range = 1; // Nombre d'utilisateurs à inclure avant et après l'utilisateur

  try {
    const rankings = await User.sequelize.query(
      "SELECT id, username, points, RANK() OVER (ORDER BY points DESC) as ranking FROM users",
      { type: QueryTypes.SELECT }
    );

    const userRankingIndex = rankings.findIndex(
      (ranking) => ranking.id === userId
    );

    if (userRankingIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    let start, end;
    if (userRankingIndex === 0) {
      // Si l'utilisateur est en premier rang
      start = 0;
      end = start + 2 * range + 1;
    } else if (userRankingIndex === rankings.length - 1) {
      // Si l'utilisateur est en dernier rang
      end = rankings.length;
      start = end - 2 * range - 1;
    } else {
      // Pour tous les autres rangs
      start = Math.max(0, userRankingIndex - range);
      end = Math.min(rankings.length, userRankingIndex + range + 1);
    }

    const rankingRange = rankings.slice(start, end);

    res.status(200).json(rankingRange);
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
  getUserRankingRange,
};