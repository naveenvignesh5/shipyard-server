const express = require("express");
const { generateToken } = require('../libs/sessions');

const router = express.Router();

router.post("/token", (req, res, next) => {
  generateToken(req, (err, data) => {
    if (err) res.status(401).send(err);
    else res.status(200).send(data);
  });
});

module.exports = router;
