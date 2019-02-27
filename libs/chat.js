const axios = require("axios");

const formApi = () => `https://chat.twilio.com/v2/Services`;

const twilioChatApi = formApi();

const createChannel = (config, cb) => {
  axios
    .post(
      `${twilioChatApi}/${process.env.TWILIO_CHAT_SERVICE_SID}/Channels`,
      {
        FriendlyName: config.name
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

module.exports = {
  createChannel,
  getChannelMessages,
};
