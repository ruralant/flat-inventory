const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    location: {
        type: mongoose.Schema.ObjectId, ref: 'Apartment'
    },
    quantity: {
        type: Number,
        default: 0
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

const Item = mongoose.model('Item', ItemSchema);

module.exports = { Item };