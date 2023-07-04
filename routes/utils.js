var express = require("express");
var router = express.Router();
const { MessageMenu } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");

router.get("/protected-route", authMiddleware, (req, res) => {
  // Route protégée par l'authentification
});

router.get("/messageMenu", async function (req, res, next) {
  try {
    const messageMenu = await MessageMenu.findOne({ where: { active: true } });
    res.json(messageMenu);
  } catch (err) {
    next(err);
  }
});

router.put("/messageMenu", async function (req, res, next) {
  try {
    const existingMessageMenu = await MessageMenu.findByPk(1);
    if (existingMessageMenu) {
      existingMessageMenu.title = req.body.title;
      existingMessageMenu.message = req.body.message;
      existingMessageMenu.active = req.body.active;
      await existingMessageMenu.save();
      res.json(existingMessageMenu);
    } else {
      res.status(404).send("Message not found");
    }
  } catch (err) {
    next(err);
  }
});

// router.post("/messageMenu", async function (req, res, next) {
//   try {
//     const newMessageMenu = await MessageMenu.create(req.body);
//     res.json(newMessageMenu);
//   } catch (err) {
//     next(err);
//   }
// });

router.post("/sendMail", async function (req, res, next) {
  console.log("sendMail");
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail", //email provider
    auth: {
      user: "your-email@gmail.com", 
      pass: "your-password",
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Your Name" <your-email@gmail.com>', // sender address
    to: req.body.mail, // list of receivers
    subject: "Password Recovery", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Error while sending mail" });
    } else {
      console.log("Message sent: %s", info.messageId);
      res.status(200).json({ message: "Mail successfully sent" });
    }
  });
});

module.exports = router;
