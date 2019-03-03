const axios = require("axios");
const sendGridApi = "https://api.sendgrid.com/v3/mail";
const onesignalApi = "https://onesignal.com/api/v1";

const sendSingleMail = async (config, cb) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`
    };
    const data = {
      personalizations: [
        {
          to: [
            {
              email: config.email,
              name: config.name
            }
          ],
          subject: "Test"
        }
      ],
      from: {
        email: "naveen@imstrong.co",
        name: "Shipyard Demo"
      },
      content: [
        {
          type: "text/plain",
          value: config.message
        }
      ]
    };
    const res = await axios.post(`${sendGridApi}/send`, data, { headers });
    cb(null, res.data);
  } catch (err) {
    cb(err, null);
  }
};

const sendGroupMail = async (users, message, cb) => {
  const headers = {
    Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`
  };

  const to = users.map(o => ({ email: o.email, name: o.username }));

  const data = {
    personalizations: [
      {
        to,
        subject: "Hello, World" // important -- without it error occurs
      }
    ],
    from: {
      email: "naveen@imstrong.co",
      name: "Shipyard Demo"
    },
    content: [
      {
        type: "text/plain",
        value: message
      }
    ]
  };

  try {
    const res = await axios.post(`${sendGridApi}/send`, data, { headers });
    cb(null, res.data);
  } catch (err) {
    cb(err, null);
  }
};

const sendNotification = async (config, cb) => {
  try {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": "Basic M2IxOWM3NjAtNzE3MS00MzZjLTg0NjMtN2IwOGYwMDhkMWZl"
    };
    const message = {
      app_id: process.env.ONESIGNAL_API,
      contents: { en: config.message },
      included_segments: ["Active Users"]
    };
    const res = await axios.post(`${onesignalApi}/notifications`, message, {
      headers
    });
    cb(null, res.data);
  } catch (err) {
    cb(err, null);
  }
};

module.exports = {
  sendSingleMail,
  sendGroupMail,
  sendNotification
};
