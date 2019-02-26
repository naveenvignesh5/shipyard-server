const express = require("express");
const {
  generateToken,
  createRoom,
  listRooms,
  completeRoom,
  getRoom
} = require("../libs/sessions");

const router = express.Router();

router.post("/token", (req, res, next) => {
  generateToken(req, (err, data) => {
    if (err) res.status(401).send(err);
    else res.status(200).send(data);
  });
});

router.post("/create", (req, res, next) => {
  try {
    createRoom(req.body, (err, data) => {
      if (err) res.status(401).send({ error: err });
      else res.status(200).send(data);
    });
  } catch (err) {
    console.log(err);
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
