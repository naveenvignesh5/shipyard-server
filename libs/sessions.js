const axios = require("axios");

const { sendGroupMail, sendMail } = require("./mail");
const twilioVideoApi = "https://video.twilio.com/v1";

// room listing, creation, removal, joining, leaving

const createRoomWithChat = async (config = {}, cb) => {
  const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const room = await client.video.rooms.create({
      uniqueName: config.name,
      type: config.type
    });

    const chat = await client.chat
      .services(process.env.TWILIO_CHAT_SERVICE_SID)
      .channels.create({ friendlyName: config.name });

    let session = await db.sessions.create({
      id: room.sid,
      chatId: chat.sid,
      adminId: config.user.id,
      name: config.name,
      Status: room.status
    });

    const users = await db.User.findAll({
      where: {
        role: "client"
      }
    });

    sendGroupMail(
      users,
      `Remainder for meeting regarding ${config.name}`,
      (err, data) => {
        if (err) {
          cb(err, null);
        } else {
          cb(null, { session, users });
        }
      }
    );
    // sendMail({ email: users[1].email, name: users[1].username }, (err, data) => {
    //   if (err) cb(err, null);
    //   else cb(null, data);
    // });
    // let i = 0;
    // let user = {};
    // users.forEach(user => {
    //   sendMail({
    //     email: user.email,
    //     message: `You have been invited to ${session.name} along with ${
    //       users.length
    //     } people.`
    //   });
    // });
    // cb(null, { session, users });
  } catch (err) {
    console.log(err.data);
    cb(err.data, null);
  }
};

const createRoom = (config = {}, cb) => {
  axios
    .post(
      `${twilioVideoApi}/Rooms`,
      {
        ...config
      },
      {
        auth: {
          username: process.env.TWILIO_API_KEY,
          password: process.env.TWILIO_API_SECRET
        }
      }
    )
    .then(res => {
      cb(null, res.data);
    })
    .catch(err => {
      cb(err, null);
    });
};

const getRoom = async (id, cb) => {
  try {
    const res = await db.sessions.findOne({
      where: { id }
    });
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
};

const completeRoom = async (config = {}, cb) => {
  try {
    const { id, chatId } = await db.sessions.findOne({
      where: {
        id: config.sessionId
      }
    });

    const client = require("twilio")(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await db.sessions.update(
      {
        Status: "completed"
      },
      { where: { id: config.sessionId } }
    );

    try {
      await client.video.rooms(id).update({ status: "completed" });
    } catch (err) {
      console.log(err);
    }

    try {
      await client.chat
        .services(process.env.TWILIO_CHAT_SERVICE_SID)
        .channels(chatId)
        .remove();
    } catch (err) {
      console.log(err);
    }

    cb(null, { message: "ended", id });
  } catch (err) {
    console.log(err);
    cb(err, null);
  }
};

const listRooms = async (config = {}, cb) => {
  try {
    const sessions = await db.sessions.findAll({
      limit: 10,
      where: { Status: config.Status }
    });
    cb(null, { rooms: sessions });
  } catch (err) {
    console.log(err);
    cb(err, null);
  }
};

const covertToPDF = async (config, cb) => {
  const convertapi = require("convertapi")(process.env.CONVERTAPI_KEY);
  try {
    const result = await convertapi.convert("pdf", { File: config.path });
    console.log(result);
    const file = await result.file.save(
      `${__dirname}/../../uploads/${result.file.name}.pdf`
    );
    cb(null, { message: "success", file });
  } catch (err) {
    cb(err, null);
  }
};

// code to recordings
const getRoomRecordings = (roomId, cb) => {
  try {
    const client = require("twilio")(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    const recs = [];
    client.video
      .rooms(roomId)
      .recordings
      .each(rec => recs.push(rec));
    cb(null, recs);
  } catch (err) {
    cb(err, null);
  }
};

module.exports = {
  createRoomWithChat,
  createRoom,
  completeRoom,
  listRooms,
  getRoom,
  covertToPDF,
  getRoomRecordings,
};
