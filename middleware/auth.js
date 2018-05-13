const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

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
  if(!req.header('authorization')) return res.status(401).send({ message: 'Not authorised' });

  let token = req.header('authorization').split(' ')[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET)

  if(!payload) return res.status(401).send({ message: 'Not authorised' });

  req.userId = payload._id;
  next();
};

let adminAuth = (req, res, next) => {
  let role = req.session.user.userType;

  role === 'admin' ? next() : res.status(400).send({ message: 'No permissions' });
};

module.exports = { authenticate, adminAuth };