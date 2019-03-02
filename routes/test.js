var express = require("express");
var router = express.Router();
var multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "../uploads");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

router.get("/", function(req, res, next) {
  res.send({ message: "It works !!!" });
});

router.get("/eventTest", (req, res, next) => {
  res.emit("event:test_event", { message: "it workds" });
});

router.post("/upload", (req, res) => {
  let uploadFile = req.files.file;
  const fileName = req.files.file.name;
  uploadFile.mv(`uploads/${fileName}`, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({
      file: `uploads/${req.files.file.name}`
    });
  });
});

module.exports = router;
