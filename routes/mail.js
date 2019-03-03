const express = require("express");

const router = express.Router();

const { sendSingleMail, sendGroupMail } = require("../libs/mail");

router.post("/send", (req, res, next) => {
  const { email, message } = req.body;
  if (!email) res.status(401).send({ message: "email required" });
  if (!message) res.status(401).send({ message: "message required" });

  try {
    sendSingleMail({ email, message }, (err, data) => {
      if (err) res.status(401).send(err);
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/sendToMany", (req, res, next) => {
  const { users, message } = req.body;

  if (!users || users.length === 0) {
    res.status(401).send({ message: "Unable to send users" });
  }

  if (!message) res.status(401).send({ message: "Enter a valid messages" });

  try {
    sendGroupMail(users, message, (err, data) => {
      if (err) {
        res.status(401).send(err);
      } else {
        res.status(200).send(data);
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
