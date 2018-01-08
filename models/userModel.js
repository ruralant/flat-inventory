const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

mongoose.Promise = global.Promise;

// a scheme for users
const UserSchema = mongoose.Schema({
  firstName: { 
    type: String
  },
  lastName: {
    type: String
  },
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

UserSchema.methods.generateAuthToken = function (access) {
  // create a new date object so we can save the date to the user login history each time a token is created
  let user = this;
  let token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, process.env.JWT_SECRET, { expiresIn: '8h' }).toString();
  return user.save()
    .then(() => token)
    .catch(e => console.log(e));
};

UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject({ action: 'logout', message: 'jwt expired, try logging out and back in again' });
  }

  return User.findOne({
    '_id': decoded._id
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({
    email,
    active: true
  })
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