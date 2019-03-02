const axios = require('axios');
const sendGridApi = "https://api.sendgrid.com/v3/mail";

const sendMail = async (config, cb) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`
    };
    const data = {
      personalizations: [
        {
          to: [
            {
              email: config.email
            }
          ],
          subject: "Test"
        }
      ],
      from: {
        email: "naveen@imstrong.co"
      },
      content: [
        {
          type: "text/plain",
          value: config.message,
        }
      ]
    };
    const res = await axios.post(`${sendGridApi}/send`, data, { headers });
    cb(null, res.data);
  } catch (err) {
    cb(err, null);
  }
};

module.exports = {
  sendMail,
};
