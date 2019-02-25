const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const ChatGrant = AccessToken.ChatGrant;

const generateToken = (req, cb) => {
  try {
    if (!req.body.userid) {
      cb({ error: 'user id not found' }, null);
    }

    let token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET
    );

    const appName = "Shipyard";
    const deviceId = req.query.device;

    const identity = req.body.userid.toString();

    const endpointId = appName + ":" + identity + ":" + deviceId;
    
    token.identity = identity;

    const videoGrant = new VideoGrant();
    // videoGrant.room = 'demo'; // TODO: Update the static room to room from list of sessions 
    const chatGrant = new ChatGrant({
      serviceSid: process.env.TWILIO_CHAT_SERVICE_SID,
      endpointId,
    });

    token.addGrant(videoGrant);
    token.addGrant(chatGrant);

    cb(null, {
      identity: token.identity,
      token: token.toJwt(),
    });

  } catch (err) {
    console.log(err);
    cb(err, null);
  }
};

module.exports = {
  generateToken
};
