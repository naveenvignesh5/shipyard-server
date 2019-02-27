const express = require("express");
const { createChannel, getChannelMessages } = require("../libs/chat");

const router = express.Router();

router.post("/create", (req, res, next) => {
  try {
    if (!req.body.name)
      res.status(401).send({ message: "Channel name is required" });

    createChannel(req.body, (err, data) => {
      if (err) res.status(401).send(err);
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/messages", (req, res, next) => {
  try {
    getChannelMessages(req.body.channelId, (err, data) => {
      if (err) res.status(401).send(err);
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
