var express = require("express");
var router = express.Router();

var { registerUser, loginUser, generateToken } = require("../libs/auth");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", function(req, res, next) {
  try {
    registerUser(req, db.User.ENUM_USER_TYPE.client, (err, data) => {
      if (err) {
        res.status(401).send(err);
      } else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/token", (req, res, next) => {
  generateToken(req, (err, data) => {
    if (err) res.status(401).send(err);
    else res.status(200).send(data);
  });
});

router.post("/login", function(req, res, next) {
  try {
    const { username, password, role } = req.body;

    if (!username) res.status(401).send({ message: "Username required !!!" });

    if (!password) res.status(401).send({ message: "Password required !!!" });

    if (!role) res.status(401).send({ message: "User role is required !!!" });

    loginUser(req.body, (err, data) => {
      if (err) res.status(401).send(err);
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send({ error: err, message: "Unable to login." });
  }
});

module.exports = router;
