const { MessageContact, MessageMenu, User } = require("../models/index.js");
const { sequelize } = require("../service/db.js");
const fs = require("fs");
const path = require("path");

const getMessages = async (req, res, next) => {
  try {
    const messages = await MessageContact.findAll();
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    await MessageContact.destroy({ where: { id } });
    res.json({ message: "Message supprimé avec succès." });
  } catch (err) {
    next(err);
  }
};

// **************** Message menu ********************

const getMessagesMenu = async (req, res, next) => {
  try {
    const messageType = req.query.messageType;

    let messageMenu;
    if (messageType) {
      if (
        messageType !== "home_not_connected" &&
        messageType !== "home_connected"
      ) {
        return res
          .status(400)
          .json({ error: "Invalid or missing messageType parameter." });
      }
      messageMenu = await MessageMenu.findAll({
        where: {
          active: true,
          message_type: messageType,
        },
      });
    } else {
      // Si aucun messageType n'est spécifié, on récupère les deux types
      messageMenu = await MessageMenu.findAll({
        where: {
          active: true,
          message_type: ["home_not_connected", "home_connected"],
        },
      });
    }

    if (!messageMenu || messageMenu.length === 0) {
      return res.status(404).json({ error: "No messages found." });
    }

    res.json(messageMenu);
  } catch (err) {
    next(err);
  }
};

const updateMessageMenu = async (req, res, next) => {
  try {
    const { messageType } = req.params;
    const { title, message, active } = req.body;

    const messageMenu = await MessageMenu.findOne({
      where: { message_type: messageType },
    });

    if (!messageMenu) {
      return res.status(404).json({ error: "Message not found." });
    }
    if (title !== undefined) {
      messageMenu.title = title;
    }
    if (message !== undefined) {
      messageMenu.message = message;
    }
    messageMenu.active =
      typeof active !== "undefined" ? active : messageMenu.active;

    await messageMenu.save();

    res.json(messageMenu);
  } catch (err) {
    next(err);
  }
};


const notifyAllUsers = async (req, res, next) => {
  try {
    await User.update({ message_read: false }, { where: {} });
    res.json({ message: "Tous les utilisateurs ont été notifiés." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMessages,
  deleteMessage,
  getMessagesMenu,
  updateMessageMenu,
  notifyAllUsers,
};
