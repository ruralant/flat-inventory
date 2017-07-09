const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

mongoose.Promise = global.Promise;

// a scheme for users
const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    minlength: 1
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }],
  userType: {
    type: String,
    required: true,
    default: "standard"
  },
  createdBy:{
    type: mongoose.Schema.ObjectId, ref: 'User'
  },
  updatedBy:{
    type: mongoose.Schema.ObjectId, ref: 'User'
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  // set the information contained in the User Object
  return _.pick(userObject, ['_id', 'email', 'firstName', 'lastName', 'userType', 'instance', 'updatedBy', 'updatedAt', 'active', 'createdAt', 'status']);
};

UserSchema.methods.generateAuthToken = function (access) {
  var user = this;
  var token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, process.env.JWT_SECRET, { expiresIn: '4h' }).toString();

  return user.save().then(() => {
    return token;
  });
};


UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    console.log(e);
    return Promise.reject({message:'jwt expired, try logging out and back in again'});
  }

  return User.findOne({
    '_id': decoded._id
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({ email })
  .then((user) => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// create a mongodb Schema for the user and export to node
const User = mongoose.model('User', UserSchema);

module.exports = User;