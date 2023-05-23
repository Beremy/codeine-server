const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Admin } = require("../models");

const createAdmin = async (admin) => {
  try {
    admin.password = await bcrypt.hash(admin.password, 10);
    return await Admin.create(admin);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAdminByUsername = async (username) => {
  return await Admin.findOne({ where: { username } });
};

const signup = async (req, res) => {
  try {
    const admin = await createAdmin(req.body);
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    const adminInfo = admin.get({ plain: true });
    delete adminInfo.password;
    res
      .status(201)
      .json({ message: "Admin created successfully", token, admin: adminInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const admin = await getAdminByUsername(req.body.username);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    const adminInfo = admin.get({ plain: true });
    delete adminInfo.password;
    res
      .status(200)
      .json({ message: "Admin signed in successfully", token, admin: adminInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signup,
  signin,
  getAllAdmins,
  getAdminById,
};
