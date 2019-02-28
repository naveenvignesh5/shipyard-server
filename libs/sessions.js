const axios = require("axios");

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

    await client.video.rooms(id).update({ status: "completed" });

    await client.chat
      .services(process.env.TWILIO_CHAT_SERVICE_SID)
      .channels(chatId)
      .remove();

    const res = await db.sessions.update(
      {
        Status: "completed"
      },
      { where: { id: config.sessionId } }
    );
    cb(null, res);
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

module.exports = {
  createRoomWithChat,
  createRoom,
  completeRoom,
  listRooms,
  getRoom
};
