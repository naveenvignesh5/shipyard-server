const axios = require("axios");

const twilioVideoApi = "https://video.twilio.com/v1";

// room listing, creation, removal, joining, leaving

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
  const params = { Status: "completed" };
  axios
    .post(`${twilioVideoApi}/Rooms/${config.roomId}`, params, {
      auth: {
        username: process.env.TWILIO_API_KEY,
        password: process.env.TWILIO_API_SECRET
      }
    })
    .then(res => {
      cb(null, res.data);
    })
    .catch(err => {
      cb(err.data, null);
    });
};

const listRooms = (config = {}, cb) => {
  axios
    .get(`${twilioVideoApi}/Rooms`, {
      params: config,
      auth: {
        username: process.env.TWILIO_API_KEY,
        password: process.env.TWILIO_API_SECRET
      }
    })
    .then(res => {
      cb(null, res.data);
    })
    .catch(err => {
      cb(err.data, null);
    });
};

module.exports = {
  createRoom,
  completeRoom,
  listRooms,
  getRoom
};
