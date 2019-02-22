var express = require('express');
var router = express.Router();

var { registerUser, loginUser } = require('../libs/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {
  try {
    registerUser(req, db.User.ENUM_USER_TYPE.client, (err, data) => {
      if (err) res.status(401).send(err);
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

router.post('/login', function(req, res, next) {
  try {
    loginUser(req, db.User.ENUM_USER_TYPE.admin, (err, data) => {
      if (err) res.status(401).send(err);
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

module.exports = router;
