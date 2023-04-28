const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

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
    res.status(201).json({ message: "User created successfully", user });
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
    res.status(200).json({ message: "User signed in successfully", token });
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
};
