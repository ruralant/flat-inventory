const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const RoomSchema = mongoose.Schema({
  reference: {
    type: String
  },
  description: {
    type: String,
  },
  location: {
    type: mongoose.Schema.ObjectId, ref: 'Apartment'
  },
  availability: {
    type: Boolean
  },
  label: {
    type: String,
    required: true,
    lowercase: true
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