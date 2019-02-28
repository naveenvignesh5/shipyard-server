const express = require("express");
const {
  createRoom,
  createRoomWithChat,
  listRooms,
  completeRoom,
  getRoom
} = require("../libs/sessions");

const router = express.Router();

router.post("/create", (req, res, next) => {
  try {
    createRoom(req.body, (err, data) => {
      if (err) res.status(401).send({ error: err });
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

router.post("/createWithChat", (req, res, next) => {
  const { user, name } = req.body;

  if (!name) res.status(401).send({ message: "Session name required !!!" });

  if (!(user && user.id))
    res.status(402).send({ message: "user or user with id required !!!" });

  try {
    createRoomWithChat(req.body, (err, data) => {
      if (err) res.status(401).send({ error: err });
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

router.post("/end", (req, res, next) => {
  try {
    completeRoom(req.body, (err, data) => {
      if (err) res.status(401).send({ error: err });
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/", (req, res, next) => {
  try {
    listRooms(req.query, (err, data) => {
      if (err) res.status(401).send({ error: err });
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

router.get("/:id", (req, res, next) => {
  try {
    getRoom(req.params.id, (err, data) => {
      if (err) res.status(401).send(err);
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

module.exports = router;
