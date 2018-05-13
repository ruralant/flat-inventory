const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

mongoose.Promise = global.Promise;

// a scheme for users
const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
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
  userType: {
    type: String,
    required: true,
    default: 'user'
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

UserSchema.methods.generateAuthToken = async function (access) {
  // create a new date object so we can save the date to the user login history each time a token is created
  try {
    let user = this;
    let token = await jwt.sign({
      _id: user._id.toHexString(),
      access
    }, process.env.JWT_SECRET, { expiresIn: '8h' }).toString();
    const newUser = await user.save();
    return token;
  } catch(e) {
    console.log(e)
  }
};

UserSchema.statics.findByToken = async function (token) {
  console.log('token in modal: ', token);
  const User = this;
  let decoded;
  try {
    decoded = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject({ action: 'logout', message: 'jwt expired, try logging out and back in again' });
  }

  return User.findOne({ '_id': decoded._id });
};

UserSchema.statics.findByCredentials = async function (email, password) {
  try {
    const User = this;
    const user = await User.findOne({ email });

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  } catch (e) {
    return Promise.reject();
  }
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