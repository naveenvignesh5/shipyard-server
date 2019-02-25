const registerUser = async (req, role, cb) => {
  let user = {};

  const username = req.body.username.trim() || "";
  const password = req.body.password.trim() || "";

  if (!username) cb({ error: "Username not found" }, null);

  if (!password) cb({ error: "Password not found" }, null);

  try {
    user = await db.User.create({
      username,
      password: db.User.hashPassword(password),
      role,
    });
    cb(null, user);
  } catch (e) {
    cb(e, null);
  }
};

const loginUser = async (req, role, cb) => {
  let user = {};
  let error = null;

  const username = req.body.username.trim() || "";
  const password = req.body.password.trim() || "";

  if (!username) cb({ error: "Username not found" }, null);

  if (!password) cb({ error: "Password not found" }, null);

  try {
    user = await db.User.findOne({
      where: {
        username,
      },
    });
    
    if (!user) error = 'No user found !!!';

    if (!user.validPassword(password)) error = 'Invalid Password !!!';

    if (error) cb({ error }, null);
    else cb(null, user);

  } catch (e) {
    cb({ error: e }, null);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
