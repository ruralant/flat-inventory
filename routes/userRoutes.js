const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { ObjectID } = require('mongodb');
const emailHandler = require('../config/email');
const reqProm = require('request-promise-native');
const http = require('http');
const request = require('request');
const User = require('../models/userModel');
let { authenticate } = require('./../middleware/auth');
// let {sendEmail} = require('./email.js');

// creates a super user if does not exist, one time only
User.findOne({ email: "super@user" }).then((user) => {
  if (!user) {
    let superUser = {
      "_id": ObjectID.ObjectId("58f60bdc7314d23bd3ce92e3"),
      "firstName": "superuser",
      "lastName": "superuser",
      "email": "super@user",
      "password": "password",
      "userType": "superuser"
    };
    var newUser = new User(superUser);
    newUser.save();
  }
});

// CREATE a user
router.post('/', authenticate, (req, res) => {
  const token = req.header('x-auth') || req.session.accessToken;
  let body = _.pick(req.body, ['_id', 'firstName', 'lastName', 'email', 'password', 'createdBy', 'userType']);

  var user = new User(body);

  User.findByToken(token)
    .then(currentUser => {
      user.createdBy = ObjectID.ObjectId(currentUser._id);
      return user.save();
    })
    .then(() => res.send({message: 'User Sent'}))
    .catch(e => res.status(400).send(e));
  
});

// CREATE a user
router.post('/register', (req, res) => {
  let body = _.pick(req.body, ['_id', 'firstName', 'lastName', 'email', 'password', 'createdBy', 'userType']);

  var user = new User(body);

  user.save()
  .then(() => res.send({message: 'User Created'}))
  .catch(e => res.status(400).send(e));
});


// log a user in
router.post('/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then(user => {
    return user.generateAuthToken('auth').then(token => {
      res.setHeader('x-auth', token);
      req.session.accessToken = token;
      req.user = user.toJSON();
      res.status(200).send({ token, user });
    });
  }).catch(e => res.status(400).send(e));
});


// make a user inactive
router.delete('/', authenticate, (req, res) => {
  User.removeToken(req.token).then(() => {
    req.session.destroy();
    res.status(200).send({
      Message: "Succesfully Logout"
    });
  }, () => {
    res.status(400).json({
      status: 'error, not logged out!'
    });
  });
});

// send a password reset link to a user
router.post('/passwordreset', (req, res) => {
  const body = _.pick(req.body, ['email']);
  User.findOne({
    email: body.email
  }).then((user) => {
    return user.generateAuthToken().then((token) => {
      let resetToken = token;
      let emailURL = (`/passwordReset/${token}`);
      emailHandler.sendEmail({
        body: {
          receiver: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          sender: 'no-reply@jayex.com',
          type: 'passwordReset',
          emailURL,
          host: 'localhost:4200'
        }
      });
      res.send({
        message: 'A password reset has been emailed to your account. Follow the instructions in the email.'
      });
    });
  }).catch(e => res.status(400).send(e));
});


// check status of current user based on a token
router.get('/status', (req, res) => {
  const token = req.header('x-auth') || req.session.accessToken;

  User.findByToken(token)
    .then(user => {
      if (!user) return res.status(401).send({ message: 'No user' });
      res.status(200).json({
        status: true,
        token,
        user
      });
    })
    .catch(e => {
      res.status(401).send({ status: false, message: 'No user' });
    });
});

// GET list of users
router.get('/', function (req, res) {
  User.find().then((user) => {
    res.send({ user });
  }, (e) => {
    res.status(400).send(e);
  });
});

// QUERY for user
router.get('/query', authenticate, (req, res) => {

  const query = {};

  if (req.query.length > 0) {
    query.$or = [];
    userLabel.forEach(label => query.$or.push({
      'label.name': new RegExp(label)
    }));
  } else {
    Object.keys(req.query).forEach(key => {
      if (key === '_id') {
        req.query[key] = ObjectID.ObjectId(req.query[key]);
        if (!query[key]) {
          query[key] = [];
        }
        query[key].push(req.query[key]);
      } else {
        if (!query[key]) {
          query[key] = [];
        }
        query[key].push(new RegExp(req.query[key]));
      }
    });
  }

  User.find(query)
    .then((user) => {
      res.send({ user }
      );
    }, (e) => {
      res.status(400).send(e);
    });
});

// UPDATE user data
router.patch('/updateUser/:id', authenticate, (req, res) => {
  const token = req.header('x-auth') || req.session.accessToken;
  const id = req.params.id;
  const body = _.pick(req.body, ['firstName', 'lastName', 'email', 'userType', 'password', 'active', '_id', 'updatedBy']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      error: "ObjectID not valid"
    });
  }

  function patchUsers(path, body) {
    let options = {
      method: 'PATCH',
      uri: path + '/api/user/updateUser/' + id,
      headers: { 'Content-Type': 'application/json', 'x-auth': token },
      body,
      json: true
    };
    reqProm(options);
  }

  let userToEditObj;

  User.findByToken(token)
    .then(user => {
      return User.findByIdAndUpdate(id, {
        $set: body,
        updatedBy: user._id
      }, {
        new: true
      });
    })
    .then(userToEdit => {
      userToEditObj = userToEdit;
      return Instance.find({});
    })
    .then(instances => {
      for(let instance of instances) {
        patchUsers(instance.hostname, userToEditObj);
      }
    })
    .then(() => res.send({message: 'User Sent'}))
    .catch(e => res.status(400).send(e));
});

// DELETE user
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      error: "ObjectID not valid"
    });
  }
  User.findByIdAndUpdate(id, {
    $set: {
      updatedBy: "Current User",
      active: false
    }
  }, {
    new: true
  })
  .then((user) => {
    if (user === null) {
      return res.status(404).send({
        error: "No user found"
      });
    }
    res.send({ user });
  })
  .catch(e => res.status(400).send(e));
});

// CHANGE password
router.patch('/profilePasswordChange', (req, res) => {
  const token = req.header('x-auth') || req.session.accessToken;

  User.findByToken(token)
    .then(user => {
      // if the auth type is password "reset" then bypass the password check
      if(req.header('x-auth-type') === 'reset') {
        return user;
      }
      return new Promise((resolve, reject) => {
        // Use bcrypt.compare to compare password and user.password
        bcrypt.compare(req.body.currentPassword, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject({ message: 'Password incorrect' });
          }
        });
      });
    })
    .then((user) => {
      user.password = req.body.newPassword;
      user.save().then(result => {
        res.status(200).send({ result });
      });
    })
    .catch(e => { res.status(400).send(e); 
  });
});

module.exports = router;