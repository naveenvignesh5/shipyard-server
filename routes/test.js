var express = require("express");
var router = express.Router();

const { sendNotification } = require("../libs/mail");

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

router.post("/notify", async (req, res) => {
  if (!req.body.message)
    res.status(401).send({ message: "Message is required" });
  sendNotification(req.body, (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(data);
  });
});

module.exports = router;
