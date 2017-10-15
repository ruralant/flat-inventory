const User = require('./../models/userModel');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth') || req.session.accessToken;
  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    req.token = token;
    next();
  })
  .catch(e => res.status(400).send({ message: "No authenticated" }));
};

const adminAuth = (req, res, next) => {
  const role = req.session.user.userType;

  if (role === 'admin') {
    next();
  } else {
    res.status(400).send({
      message: "No permissions"
    });
  }
};

module.exports = {
  authenticate,
  adminAuth
};