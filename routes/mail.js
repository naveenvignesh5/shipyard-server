const express = require("express");

const router = express.Router();

const { sendMail } = require("../libs/mail");

router.post("/send", (req, res, next) => {
  const { email, message } = req.body;
  if (!email) res.status(401).send({ message: "email required" });
  if (!message) res.status(401).send({ message: "message required" });

  try {
    sendMail({ email, message }, (err, data) => {
      if (err) res.status(401).send(err);
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
