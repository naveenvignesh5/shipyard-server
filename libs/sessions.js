const axios = require("axios");

const twilioVideoApi = "https://video.twilio.com/v1";

// room listing, creation, removal, joining, leaving

const createRoomWithChat = async (config = {}, cb) => {
  const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const room = await client.video.rooms.create({ uniqueName: config.name });

    const chat = await client.chat
      .services(process.env.TWILIO_CHAT_SERVICE_SID)
      .channels.create({ friendlyName: config.name });

    let session = await db.sessions.create({
      id: room.sid,
      chatId: chat.sid,
      adminId: config.user.id,
      name: config.name
    });
    console.log(session);
    cb(null, session);
  } catch (err) {
    console.log(err);
    cb(err, null);
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

const getRoom = (id, cb) => {
  axios
    .get(`${twilioVideoApi}/Rooms/${id}`, {
      auth: {
        username: process.env.TWILIO_API_KEY,
        password: process.env.TWILIO_API_SECRET
      }
    })
    .then(result => cb(null, result.data))
    .catch(err => cb(err.data, null));
};

const completeRoom = (config = {}, cb) => {
  const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
};

const listRooms = async (config = {}, cb) => {
  // axios
  //   .get(`${twilioVideoApi}/Rooms`, {
  //     params: config,
  //     auth: {
  //       username: process.env.TWILIO_API_KEY,
  //       password: process.env.TWILIO_API_SECRET
  //     }
  //   })
  //   .then(res => {
  //     cb(null, res.data);
  //   })
  //   .catch(err => {
  //     cb(err.data, null);
  //   });
  try {
    db.session.findAll({
      limit: 10,
      active: true
    });
  } catch (err) {}
};

module.exports = {
  createRoomWithChat,
  createRoom,
  completeRoom,
  listRooms,
  getRoom
};
