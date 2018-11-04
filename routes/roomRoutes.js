const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

const User = require('../models/userModel');
const { Room } = require('../models/roomModel');
let { authenticate } = require('./../middleware/auth');


// GET all the rooms
router.get('/', authenticate, async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('apartment')
      .populate('user');
    if (!rooms) res.status(400).send({ error: 'No rooms found', api: 'GET/rooms' });
    
    res.send({ message: 'Rooms retrieved successfully', api: 'GET/rooms', rooms });
  } catch (e) {
    res.status(400).send({ error: 'There was an error in retrieving the rooms', api: 'GET/rooms', e });
  }
});

// GET query of rooms
router.get('/query', authenticate, async (req, res) => {
  try {
    const searchQuery = req.query;
    // in the search term I want to be able to query both query with name or description, then query both with only one. So I take which has been queried and copy that across to query both, plus I query the label with the search term just for wider visibility
    if (req.query.name || req.query.description) {
      req.query.$or = [];
      req.query.$or.push({ name: new RegExp(req.query.name || req.query.description, 'i') });
      req.query.$or.push({ description: new RegExp(req.query.description || req.query.name, 'i') });
      req.query.$or.push({ 'label': new RegExp(req.query.description || req.query.name, 'i') });
      delete req.query.name;
    }
    const mongoQuery = { $and: [{ }] };

    mongoQuery.$and.push(searchQuery);
  
    const rooms = await Room.find(mongoQuery)
      .populate('apartment')
      .populate('user');
    if (!rooms) res.status(400).send({ error: 'No rooms found', api: 'GET/rooms/query' });

    res.send({ message: 'Rooms retrieved by the query', api: 'GET/rooms/query', rooms });
  } catch (e) {
    res.status(400).send({ error: 'There was an error in retrieving the rooms', api: 'GET/rooms/query', e });
  }
});

// Create a new room
router.post('/', authenticate, async (req, res) => {
  try {
    const token = req.header('authorization').split(' ')[1];
    const { body } = req;
  
    let room = new Room(body);
  
    const user = await User.findByToken(token);
    if (!user) res.status(400).send({ error: 'No user found', api: 'POST/rooms' });
    
    room.createdBy = user;
    room = room.save();
    
    res.send({ message: 'Room correctly created', api: 'POST/rooms', room });
  } catch (e) {
    res.status(400).send({ error: 'There was an error in creating the room', api: 'POST/rooms', e });
  }
});

// UPDATE room
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const token = req.header('authorization').split(' ')[1];
    const { id } = req.params;
    const { body } = req;
  
    if (!ObjectID.isValid(id)) return res.status(404).send({ error: 'ObjectID not valid', api: `PATCH/rooms/${id}` });
  
    const user = User.findByToken(token);
    if (!user) res.status(400).send({ error: 'No user found', api: `PATCH/rooms/${id}` });
    
    const room = await Room.findByIdAndUpdate(id, {
      $set: body,
      updatedBy: user._id
    }, { new: true });

    res.send({ message: 'Room information correctly modified', api: `PATCH/rooms/${id}`, room });
  } catch (e) {
    res.status(400).send({ error: 'There was an error in updating the room', api: 'PATCH/rooms', e });
  }
});

// DELETE room
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
  
    if (!ObjectID.isValid(id)) return res.status(404).send({ error: 'ObjectID not valid', api: `DELETE/rooms/${id}` });
  
    const result = Room.findByIdAndRemove(id);
    
    res.send({ message: 'Room successfully deleted', api: `DELETE/rooms/${id}`, result });
  } catch (e) {
    res.status(400).send({ error: 'There was an error in deleting the room', api: 'DELETE/rooms/', e });
  }
});

module.exports = router;
