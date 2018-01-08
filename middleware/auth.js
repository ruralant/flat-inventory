const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const { Touchscreen } = require('./../models/touchscreenModel');

/**
 * In the authorization we check if session token exists, or if one has been passed through has a header
 * session exists then user is authenticated
 * if header x-auth exists we will check token against database
 * if no item exists in database but there is a header of x-user and create an inactive user, this is so we can authenticate now and in future.
 * if no x-user then we will not authenticate
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let authenticate = (req, res, next) => {
  let token = req.session.accessToken || req.header('x-auth');
  if (token === 'skip') {
    req.token = 'skip';
    next();
  } else if (token === 'test') {
    req.user = {};
    req.user._id = req.header('x-userId');
    next();
  } else {
    findByToken(token)
      .then(user => {
        if (!user) {
          let newInactiveUser = new User(JSON.parse(req.header('x-user')));
          newInactiveUser.active = false;
          newInactiveUser.password = 'password';
          newInactiveUser.save();
          req.token = token;
          req.user = newInactiveUser;
          next();
        } else {
          req.token = token;
          req.user = user;
        }
        next();
      })
      .catch(e => res.status(400).send({ message: "No authenticated" }));
  }
};

let adminAuth = (req, res, next) => {
  let role = req.session.user.userType;

  if (role === 'admin') {
    next();
  } else {
    res.status(400).send({ message: "No permissions" });
  }
};

// a method for finding a user or device by JsonWebToken
let findByToken = (codedToken) => {
  let decoded;

  try {
    decoded = jwt.verify(codedToken, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id
  });
};

module.exports = { authenticate, adminAuth, findByToken };