const mongoose = require('mongoose');

const ApartmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    availability: {
        type: Boolean
    },
    rooms: {
        type: mongoose.Schema.ObjectId, ref: 'Room'
    },
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