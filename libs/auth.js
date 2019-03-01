const uuidV4 = require("uuid/v4");

const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const ChatGrant = AccessToken.ChatGrant;

const generateToken = (req, cb) => {
  try {
    if (!req.body.userid) {
      cb({ error: "user id not found" }, null);
    }

    let token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET
    );

    const identity = req.body.userid.toString();

    token.identity = identity;

    const videoGrant = new VideoGrant();
    // videoGrant.room = 'demo'; // TODO: Update the static room to room from list of sessions
    const chatGrant = new ChatGrant({
      serviceSid: process.env.TWILIO_CHAT_SERVICE_SID,
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

const registerUser = async (req, role, cb) => {
  let user = {};
  let error = null;
  const username = req.body.username.trim() || "";
  const password = req.body.password.trim() || "";

  if (!username) cb({ error: "Username not found" }, null);

  if (!password) cb({ error: "Password not found" }, null);

  try {
    user = await db.User.findOne({
      where: {
        username
      }
    });

    console.log(user);
    if (user && user.id) {
      error = "Username already registered";
      cb({ message: error}, null);
    } else {
      user = await db.User.create({
        id: uuidV4(),
        username,
        password: db.User.hashPassword(password),
        role
      });
  
      if (error) cb({ message: error }, null);
      else cb(null, user);
    }

    
  } catch (e) {
    console.log(e);
    cb(e, null);
  }
};

const loginUser = async (config = {}, cb) => {
  let user = {};
  let error = null;

  const username = config.username.trim() || "";
  const password = config.password.trim() || "";
  const role = config.role.trim() || "";

  if (!username) cb({ error: "Username not found" }, null);

  if (!password) cb({ error: "Password not found" }, null);

  try {
    user = await db.User.findOne({
      where: {
        username,
        role,
      },
    });

    if (!user) {
      error = "No user found !!!";
      cb({ message: error });
    } else {
      if (!user.validPassword(password)) error = "Invalid Password !!!";
      // if (!user.validType(role)) error = `Authorization not given to ${user.role}`;
  
      if (error) cb({ message: error }, null);
      else cb(null, user);
    }

  } catch (e) {
    console.log(e);
    cb({ error: e }, null);
  }
};

module.exports = {
  registerUser,
  loginUser,
  generateToken
};
