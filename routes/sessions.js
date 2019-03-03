const express = require("express");
const {
  createRoom,
  createRoomWithChat,
  listRooms,
  completeRoom,
  getRoom,
  covertToPDF
} = require("../libs/sessions");

const fs = require("fs");

const { sendMail } = require("../libs/mail");

const router = express.Router();

router.post("/create", (req, res, next) => {
  try {
    createRoom(req.body, (err, data) => {
      if (err) res.status(401).send({ error: err });
      else {
        sendMail(
          {
            email: req.body.email,
            message: `You have been invited to attend conference about ${
              req.body.name
            }`
          },
          (err, data) => {
            if (err) res.status(401).send(err);
            else res.status(200).send(data);
          }
        );
        res.status(200).send(data);
      }
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

router.get("/files/:sessionId", (req, res, next) => {
  if (!req.params.sessionId)
    res.status(401).send({ message: "session id required !!!" });

  try {
    console.log(__dirname);
    fs.readdir(
      __dirname + "../../uploads/" + req.params.sessionId,
      (err, files) => {
        if (err) {
          res.status(401).send({ message: err.message });
        } else {
          res.status(200).send({ files });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/upload", (req, res) => {
  let uploadFile = req.files.file;
  const fileName = req.files.file.name;

  console.log(req.files.file);

  const sessionId = req.body.sessionId;

  const dir = `uploads/${sessionId}`;

  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  uploadFile.mv(`${dir}/${fileName}`, err => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    // covertToPDF(
    //   {
    //     path: `${__dirname}/../../../shipyard-server/uploads/${sessionId}/${fileName}`
    //   },
    //   (err, data) => {
    //     if (err) console.log(err);
    //     console.log(data);
    //   }
    // );
    res.json({
      file: `uploads/${sessionId}/${req.files.file.name}`
    });
  });
});

router.post("/createWithChat", (req, res, next) => {
  const { user, name } = req.body;

  let type = "group"; // defaults to group

  if (!name) res.status(401).send({ message: "Session name required !!!" });

  if (!(user && user.id))
    res.status(402).send({ message: "user or user with id required !!!" });

  try {
    createRoomWithChat({ user, name, type }, (err, data) => {
      if (err) res.status(401).send({ error: err });
      else res.status(200).send(data);
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

router.post("/end", (req, res, next) => {
  try {
    if (!req.body.sessionId)
      res.status(401).send({ message: "session id missing !!!" });

    completeRoom(req.body, (err, data) => {
      console.log(data);
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
