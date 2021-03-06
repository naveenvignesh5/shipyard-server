const axios = require("axios");

const twilioChatApi = "https://chat.twilio.com/v2/Services";

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
    .then(res => {
      console.log(res.data);
      cb(null, res.data);
    })
    .catch(err => {
      console.log(err);
      cb(err.data, null);
    });
};

const getChannel = async (channelId, cb) => {
  const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const res = await client.chat
      .services(process.env.TWILIO_CHAT_SERVICE_SID)
      .channels(channelId)
      .fetch();
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
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
    .then(res => {
      console.log(res);
      cb(null, res.data);
    })
    .catch(err => cb(err.data, null));
};

const addMessage = async (config, cb) => {
  // method 1: add by api
  
  // axios
  //   .post(
  //     `${twilioChatApi}/${process.env.TWILIO_CHAT_SERVICE_SID}/Channels/${
  //       config.channelId
  //     }/Messages/`,
  //     { body: config.message, from: config.username },
  //     {
  //       auth: {
  //         username: process.env.TWILIO_API_KEY,
  //         password: process.env.TWILIO_API_SECRET
  //       }
  //     }
  //   )
  //   .then(res => cb(null, res.data))
  //   .catch(err => cb(err.data, null));

  // method 2: add by library
  const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const res = await client.chat
        .services(process.env.TWILIO_CHAT_SERVICE_SID)
        .channels(config.channelId).messages.create({ body: config.message, from: config.username });
    cb(null, res);
  } catch (err) {
    cb(err.data, null);
  }
};

module.exports = {
  createChannel,
  getAllChannels,
  deleteChannel,
  getChannelMessages,
  getChannel,
  addMessage
};
