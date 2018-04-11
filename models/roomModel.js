const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const RoomSchema = mongoose.Schema({
  reference: {
    type: String,
    trim: true
  },
  description: {
    type: String,
  },
  location: {
    type: mongoose.Schema.ObjectId, ref: 'Apartment'
  },
  availability: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    lowercase: true,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId, ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId, ref: 'User'
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = { Room };