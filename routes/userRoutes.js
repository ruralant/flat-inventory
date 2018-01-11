const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { ObjectID } = require('mongodb');
const emailHandler = require('../config/email');
const User = require('../models/userModel');
const { authenticate } = require('./../middleware/auth');

// creates a super user if does not exist, one time only
User.findOne({ email: 'superuser@jayex.com' })
  .then((user) => {
    if (!user) {
      let superUser = {
        'firstName': 'superuser',
        'lastName': 'superuser',
        'email': 'super@user',
        'password': 'password',
        'userType': 'superuser',
        'active': true
      };
      var newUser = new User(superUser);
      newUser.save();
    }
  });

// CREATE a user
router.post('/', authenticate, (req, res) => {
  let { body } = req;

  var user = new User(body);

  user.save()
    .then(() => res.send({ status: 'success', message: 'New user created' }))
    .catch(e => res.status(400).send({ status: 'fail', message: 'Unable to create new user', e }));
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  let savedUser;

  User.findByCredentials(email, password)
    .then(user => {
      savedUser = user;
      return user.generateAuthToken('auth');
    })
    .then(token => {
      console.log('token', token);
      res.setHeader('Set-Cookie', token);
      req.session.accessToken = token;
      let { _id, email, firstName, lastName, userType } = savedUser.toJSON();
      req.session.user = {};
      req.session.user = { _id, email, firstName, lastName, userType };
      console.log('session: ', req.session);
      res.send({
        token,
        user: req.session.user
      });
    })
    .catch(e => {
      console.log(e);
      res.status(400).send({ status: 'fail', message: 'Unable to login', e });
    });
});

// make a user inactive
router.delete('/', (req, res) => {
  req.session.destroy();
  res.send({ message: 'Successfully Logout' });
});

// send a password reset link to a user
router.post('/passwordreset', (req, res) => {
  const body = _.pick(req.body, ['email', 'host']);
  let userFound;
  User.findOne({ email: body.email })
    .then(user => {
      userFound = user;
      return user.generateAuthToken('resetPassword');
    })
    .then(token => {
      let emailURL = (`/passwordReset/${token}`);
      emailHandler.sendEmail({
        body: {
          receiver: userFound.email,
          firstName: userFound.firstName,
          lastName: userFound.lastName,
          type: 'passwordReset',
          emailURL,
          host: body.host,
        }
      });
      res.send({
        message: 'A password reset has been emailed to your account. Follow the instructions in the email.'
      });
    })
    .catch(e => {
      console.log(e);
      res.status(400).send({ func: 'Password reset error', e });
    });
});

// check status of current user based on a token
router.get('/status', authenticate, (req, res) => {
  res.status(200).json({
    status: true,
    user: req.session.user,
    token: req.session.accessToken
  });
});

// GET list of users
router.get('/', (req, res) => {
  User.find()
    .populate('updatedBy')
    .then(user => res.send({ user }))
    .catch(e => res.status(400).send({ e }));
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
    .populate('updatedBy')
    .then(user => res.send({ user }))
    .catch(e => res.status(400).send(e));
});

// UPDATE user data
router.patch('/updateUser/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const { body } = req;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({ error: 'ObjectID not valid' });
  }

  User.findByIdAndUpdate(id, {
    $set: body,
    updatedBy: ObjectID.ObjectId(req.session.user._id)
  }, { new: true })
    .then(user => {
      req.session.user.firstName = user.firstName;
      req.session.user.lastName = user.lastName;
      res.send({ message: 'User Sent' });
    })
    .catch(e => res.status(400).send(e));
});

// DELETE user
router.delete('/:id', authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) return res.status(404).send({ error: 'ObjectID not valid' });

  User.findByIdAndUpdate(id, {
    $set: {
      updatedBy: ObjectID.ObjectId(req.session.user._id),
      active: false
    }
  }, { new: true })
    .then(() => res.send({ message: 'User Deleted' }))
    .catch(e => res.status(400).send(e));
});

// CHANGE password
router.patch('/profilePasswordChange', authenticate, (req, res) => {
  const token = req.session.accessToken;

  User.findByToken(token)
    .then(user => {
      // if the auth type is password "reset" then bypass the password check
      if (req.header('x-auth-type') === 'reset') {
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
    .then(user => {
      user.password = req.body.newPassword;
      return user.save()
        .then(result => res.status(200).send({ result }));
    })
    .catch(e => res.status(400).send(e));
});

module.exports = router;