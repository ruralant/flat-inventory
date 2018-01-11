const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');
const emailHandler = require('../config/email');
const request = require('request');
const reqProm = require('request-promise-native');

const User = require('../models/userModel');
const { Instance } = require('../models/instanceModel.js');
let { authenticate } = require('./../middleware/auth');

// creates a super user if does not exist, one time only
User.findOne({ email: "superuser@jayex.com" })
  .then((user) => {
    if (!user) {
      let superUser = {
        "_id": ObjectID.ObjectId("58f60bdc7314d23bd3ce92e3"),
        "firstName": "superuser",
        "lastName": "superuser",
        "email": "superuser@jayex.com",
        "password": "password",
        "userType": "superuser"
      };
      var newUser = new User(superUser);
      newUser.save();
    }
  });

// CREATE a user
router.post('/', authenticate, (req, res) => {
  const token = req.session.accessToken;
  let { body } = req;

  var user = new User(body);

  function postUsers(path, userId, body) {
    let user = body;
    user.tempId = userId.toString();
    user.userType = 'superuser';

    let options = {
      url: path + '/api/user',
      headers: {
        'Content-Type': 'application/json',
        'x-auth': token
      },
      form: user
    };

    request.post(options, function (err, res, body) {
      if (err) {
        console.log(err);
      }
    });
  }

  let userToSaveObj;

  user.save()
    .then(userToSave => {
      userToSaveObj = userToSave;
      return Instance.find({});
    })
    .then(instances => {
      for (let instance of instances) {
        postUsers(instance.hostname, userToSaveObj._id, body);
      }
    })
    .then(() => res.send({ status: 'success', message: 'New user created' }))
    .catch(e => res.status(400).send({ status: 'fail', message: 'Unable to create new user', e }));
});

// LOGIN
router.post('/login', (req, res) => {
  const { body } = req;
  let savedUser;

  User.findByCredentials(body.email, body.password)
    .then(user => {
      savedUser = user;
      return user.generateAuthToken('auth');
    })
    .then(token => {
      res.setHeader('Set-Cookie', token);
      req.session.accessToken = token;
      let { _id, email, firstName, lastName, userType } = savedUser.toJSON();
      req.session.user = {};
      req.session.user = { _id, email, firstName, lastName, userType };
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
      let resetToken = token;
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
    .catch(e => res.status(400).send({ func: 'Password reset error', e }));
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
    .then((user) => res.send({ user }))
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
    .then((user) => {
      res.send({ user });
    }, (e) => res.status(400).send(e));
});

// UPDATE user data
router.patch('/updateUser/:id', authenticate, (req, res) => {
  const token = req.session.accessToken;
  const { id } = req.params;
  const { body } = req;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({ error: "ObjectID not valid" });
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

  User.findByIdAndUpdate(id, {
    $set: body,
    updatedBy: ObjectID.ObjectId(req.session.user._id)
  }, { new: true })
    .then(userToEdit => {
      userToEditObj = userToEdit;
      return Instance.find({});
    })
    .then(instances => {
      for (let instance of instances) {
        patchUsers(instance.hostname, userToEditObj);
      }
    })
    .then(() => {
      req.session.user.firstName = user.firstName;
      req.session.user.lastName = user.lastName;
      res.send({ message: 'User Sent' });
    })
    .catch(e => res.status(400).send(e));
});

// DELETE user
router.delete('/:id', authenticate, (req, res) => {
  const token = req.session.accessToken;
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({ error: "ObjectID not valid" });
  }

  function deleteUsers(path) {
    let options = {
      method: 'DELETE',
      uri: path + '/api/user/' + id,
      headers: {
        'Content-Type': 'application/json',
        'x-auth': token
      }
    };
    reqProm(options);
  }

  User.findByIdAndUpdate(id, {
    $set: {
      updatedBy: ObjectID.ObjectId(req.session.user._id),
      active: false
    }
  }, { new: true })
    .then(userToDelete => {
      return Instance.find({});
    })
    .then(instances => {
      for (let instance of instances) {
        deleteUsers(instance.hostname);
      }
    })
    .then(() => res.send({ message: 'User Deleted' }))
    .catch(e => res.status(400).send(e));
});

// CHANGE password
router.patch('/profilePasswordChange', authenticate, (req, res) => {
  const token = req.session.accessToken;

  let userToSave;

  // update the password on the client side
  function resetPasswordUsers(path, userId, body) {
    let options = {
      url: path + '/api/user/updateUser/' + userId,
      headers: {
        'Content-Type': 'application/json',
        'x-auth': token
      },
      form: { password: body.password }
    };

    request.patch(options, function (err, res, body) {
      if (err) {
        console.log(err);
      }
    });
  }

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
            reject({
              message: 'Password incorrect'
            });
          }
        });
      });
    })
    .then((user) => {
      user.password = req.body.newPassword;
      return user.save()
        .then(savedUser => {
          userToSave = savedUser;
          return Instance.find({});
        })
        .then(instances => {
          for (let instance of instances) {
            resetPasswordUsers(instance.hostname, userToSave._id, userToSave);
          }
        })
        .then(result => res.status(200).send({ result }));
    })
    .catch(e => res.status(400).send(e));
});

router.get('/postManyUsers/:id', authenticate, (req, res) => {
  const token = req.session.accessToken;
  const { id } = req.params;
  let remoteUri;

  Instance.findById(id)
    .then(result => {
      remoteUri = result.hostname;
      return User.find({ active: true });
    })
    .then(users => {
      let body = users;
      let options = {
        method: 'POST',
        uri: `${remoteUri}/api/user/many`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth': token
        },
        body: { "users": body },
        json: true
      };
      return reqProm(options);
    })
    .then(string => res.send(string))
    .catch(e => res.status(400).send(e));
});

module.exports = router;