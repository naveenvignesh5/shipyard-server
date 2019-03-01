const express = require("express");
const {
  createChannel,
  getChannelMessages,
  addMessage,
  deleteChannel,
  getAllChannels,
  getChannel
} = require("../libs/chat");

const router = express.Router();

router.put("/channels", (req, res, next) => {
  try {
    if (!req.body.name)
      res.status(401).send({ message: "Channel name is required" });

    createChannel(req.body, (err, data) => {
      if (err) res.status(401).send(err);
      else res.status(200).send(data);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/channels", (req, res, next) => {
  try {
    getAllChannels((err, data) => {
      if (err) res.status(401).send(err);
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/channels/:channelId", (req, res, next) => {
  try {
    getChannel(req.params.channelId, (err, data) => {
      if (err) res.status(401).send(err);
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/channels/:channelId", (req, res, next) => {
  try {
    deleteChannel(req.params.channelId, (err, data) => {
      if (err) res.status(401).send(err);
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/messages/:channelId", (req, res, next) => {
  try {
    getChannelMessages(req.params.channelId, (err, data) => {
      if (err) res.status(401).send(err);
      else {
        console.log(data);
        res.status(200).send(data);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.put("/messages", (req, res, next) => {
  try {
    const { channelId = "", message = "", username } = req.body;
    if (!channelId)
      res.status(401).send({ message: "channel id is required !!!" });

    if (!message) res.status(401).send({ message: "Enter a message !!!" });

    if (!username) res.status(401).send({ message: "Username required !!!" });

    addMessage(req.body, (err, data) => {
      if (err) res.status(401).send(err);
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
