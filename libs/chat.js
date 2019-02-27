const axios = require("axios");


const createChannel = (config, cb) => {
  const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  client.chat
    .services(process.env.TWILIO_CHAT_SERVICE_SID)
    .channels.create({ friendlyName: config.name, createdBy: config.username })
    .then(res => cb(null, res))
    .catch(err => cb(err, null));
};

const deleteChannel = (channelId, cb) => {
  axios
    .delete(
      `${twilioChatApi}/${
        process.env.TWILIO_CHAT_SERVICE_SID
      }/Channels/${channelId}`,
      {
        auth: {
          username: process.env.TWILIO_API_KEY,
          password: process.env.TWILIO_API_SECRET
        }
      }
    )
    .then(res => cb(null, res.data))
    .catch(err => cb(err.data, null));
};

const getAllChannels = cb => {
  axios
    .get(`${twilioChatApi}/${process.env.TWILIO_CHAT_SERVICE_SID}/Channels`, {
      auth: {
        username: process.env.TWILIO_API_KEY,
        password: process.env.TWILIO_API_SECRET
      }
    })
    .then(res => cb(null, res.data))
    .catch(err => cb(err.data, null));
};

const getChannelMessages = (channelId, cb) => {
  axios
    .get(
      `${twilioChatApi}/${
        process.env.TWILIO_CHAT_SERVICE_SID
      }/Channels/${channelId}/Messages`,
      {
        auth: {
          username: process.env.TWILIO_API_KEY,
          password: process.env.TWILIO_API_SECRET
        }
      }
    )
    .then(res => cb(null, res.data))
    .catch(err => cb(err.data, null));
};

const addMessage = (config, cb) => {
  axios
    .post(
      `${twilioChatApi}/${process.env.TWILIO_CHAT_SERVICE_SID}/Channels/${
        config.channelId
      }/Messages/`,
      { body: config.message, from: config.username },
      {
        auth: {
          username: process.env.TWILIO_API_KEY,
          password: process.env.TWILIO_API_SECRET
        }
      }
    )
    .then(res => cb(null, res.data))
    .catch(err => cb(err.data, null));
};

module.exports = {
  createChannel,
  getAllChannels,
  deleteChannel,
  getChannelMessages,
  addMessage
};
