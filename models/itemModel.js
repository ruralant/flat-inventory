const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const ItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  location: [{
    type: mongoose.Schema.ObjectId, ref: 'Apartment'
  }],
  quantity: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  },
  labels: [{
    type: String,
    lowercase: true,
    trim: true
  }],
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

const Item = mongoose.model('Item', ItemSchema);

module.exports = { Item };