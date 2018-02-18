const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const ApartmentSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true,
  },
  available: {
    type: Boolean,
    default: false
  },
  rooms: [{
    type: mongoose.Schema.ObjectId, ref: 'Room'
  }],
  label: {
    type: String,
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

const Apartment = mongoose.model('Apartment', ApartmentSchema);

module.exports = { Apartment };