const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { ObjectID } = require('mongodb');
const emailHandler = require('../config/email');
const User = require('../models/userModel');
const { authenticate } = require('./../middleware/auth');

// CREATE a user
router.post('/register', async (req, res) => {
  try {
    const { body } = req;
  
    const user = new User(body);
    const newUser = await user.save();

    res.send({ status: 'success', message: 'New user created' });
  } catch (e) {
    res.status(400).send({ error: 'Unable to create new user', e });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken('auth');

    res.send({ message: 'User logged in succesfully', token });
  } catch (e) {
    res.status(400).send({ error: 'Unable to login', e });
  }
});

// Send a password reset link to a user
router.post('/password-reset', async (req, res) => {
  try {
    const { email, host } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) res.status(400).send({ error: 'No user found', api: 'POST/user/password-reset' });

    const token = await user.generateAuthToken('resetPassword');
    if (!token) res.status(400).send({ error: 'Error in generating the token', api: 'POST/users/password-reset' });
    
    const emailURL = (`/password-reset/${token}`);
      
    const emailToSend = await emailHandler.sendEmail({
      body: {
        receiver: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: 'passwordReset',
        emailURL,
        host,
      }
    });
    res.send({ message: 'A password reset has been emailed to your account. Follow the instructions in the email.' });
  } catch (e) {
    res.status(400).send({ error: 'Password reset error', api: 'POST/users/password-reset', e });
  }
});

// Check status of current user based on a token
router.get('/status', authenticate, async (req, res) => {
  try {
    const token = req.header('authorization').split(' ')[1];
    
    const user = await User.findById(req.userId);
    if (!user) res.status(400).send({ error: 'No user found. Authentication failed', api: 'GET/users/status' });

    res.status(200).json({ 
      status: true,
      user,
      token
    });
  } catch (e) {
    res.status(400).send({ error: 'Error getting the status' });
  }
});

// GET list of all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password -__v').populate('updatedBy')
    if (!users) res.status(400).send({ error: 'No users found', api: 'GET/user/' });
    
    res.send({ message: 'List of users', api: 'GET/user', user });
  } catch (e) {
    res.status(400).send({ error: 'Error in retrieving the users', api: 'GET/users', e });
  }
});

// QUERY for user
router.get('/query', authenticate, async (req, res) => {
  try {
    const query = {};
  
    if (req.query.length > 0) {
      query.$or = [];
  
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
  
    const users = await User.find(query).populate('updatedBy');
    if (!users) res.status(204).send({ message: 'The query did not returned any user', api: 'GET/users/query', e });

    res.send({ message: 'Users matching the query', api: 'GET/users/query', users });
  } catch (e) {
    res.status(400).send({ error: 'There was an error in retrieving the users using the query', api: 'GET/users/query', e });
  }
});

// UPDATE user data
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
  
    if (!ObjectID.isValid(id)) return res.status(404).send({ error: 'ObjectID not valid', api: 'PATCH/users' });
  
    const user = await User.findByIdAndUpdate(id, { 
      $set: body,
      updatedBy: ObjectID.ObjectId(req.session.user._id)
    }, { new: true });
    if (!users) res.status(400).send({ error: 'No users found', api: 'PATCH/users' });

    res.send({ message: 'User updated correctly', api: 'PATCH/users' });
  } catch (e) {
    res.status(400).send({ error: 'There was an error in updating the user information', api: 'PATCH/users', e });
  }
});

// DELETE user
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
  
    if (!ObjectID.isValid(id)) return res.status(404).send({ error: 'ObjectID not valid', api: `DELETE/users/${id}` });
  
    const user = await User.findOneAndRemove(id);
    res.send({ message: 'User correctly deleted', api: `DELETE/users/${id}` });
  } catch (e) {
    res.status(400).send({ error: 'There was an error in deleting the user', api: `DELETE/users/${id}`, e })
  }
});

// CHANGE password
router.patch('/profile-password-change', authenticate, (req, res) => {
  const token = req.header('authorization').split(' ')[1];

  User.findByToken(token)
    .then(user => {
      // if the auth type is password "reset" then bypass the password check
      if (req.header('x-auth-type') === 'reset') return user;

      return new Promise((resolve, reject) => {
        // Use bcrypt.compare to compare password and user.password
        bcrypt.compare(req.body.currentPassword, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject({ error: 'Password incorrect', api: 'PATCH/users/profile-password-change' });
          }
        });
      });
    })
    .then(user => {
      user.password = req.body.newPassword;
      return user.save()
        .then(result => res.status(200).send({ message: 'Password changed correctly', api: 'PATCH/users/profilePasswordChange', result }));
    })
    .catch(e => res.status(400).send({ error: `There was an error in changing the user' password`, api: 'PATCH/users/profilePasswordChange', e }));
});



module.exports = router;