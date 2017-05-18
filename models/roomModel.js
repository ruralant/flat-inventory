const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
    reference: {
        type: String
    },
    location: {
        type: mongoose.Schema.ObjectId, ref: 'Apartment'
    },
    availability: {
        type: Boolean
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = { Room };