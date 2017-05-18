const mongoose = require('mongoose');

const ApartmentSchema = mongoose.Schema({
    name: {
        type: String
    },
    location: {
        type: String,
    },
    availability: {
        type: Boolean
    },
    rooms: {
        type: mongoose.Schema.ObjectId, ref: 'Room'
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const Apartment = mongoose.model('Apartment', ApartmentSchema);

module.exports = { Apartment };