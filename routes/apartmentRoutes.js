const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

const User = require('../models/userModel');
const { Apartment } = require('../models/apartmentModel');
let { authenticate } = require('./../middleware/auth');


// GET all the apartments
router.get('/', authenticate, async (req, res) => {
  try {
    const token = req.header('authorization').split(' ')[1];
      
    const user = await User.findByToken(token);
    const apartments = await Apartment.find({ createdBy: ObjectID.ObjectId(user._id) })
      .populate('rooms')
      .populate('user')
      .populate('updatedBy')

      res.send(apartments);
  } catch (e) {
    res.status(400).send({ message: 'Error in retrieving the apartments list', api: 'GET/apartments' })
  }
});

// GET query of apartments
router.get('/query', authenticate, async (req, res) => {
  try {
    const searchQuery = req.query;
    // in the search term I want to be able to query both query with name or description, then query both with only one. So I take which has been queried and copy that across to query both, plus I query the label with the search term just for wider visibilty
    if (req.query.name || req.query.description) {
      req.query.$or = [];
      req.query.$or.push({ name: new RegExp(req.query.name || req.query.description, 'i') });
      req.query.$or.push({ name: new RegExp(req.query.name || req.query.description || req.query.location, 'i') });
      req.query.$or.push({ description: new RegExp(req.query.location || req.query.description || req.query.name, 'i') });
      req.query.$or.push({ 'label': new RegExp(req.query.description || req.query.name, 'i') });
      delete req.query.name;
    }
    const mongoQuery = { $and: [{ }] };
    mongoQuery.$and.push(searchQuery);
  
    const apartments = await Apartment.find(mongoQuery)
      .populate('rooms')
      .populate('user')
      .populate('updatedBy');

      if (apartments.length === 1) {
        const apartment = apartments[0];
        res.send(apartment)
      } else {
        res.send(apartments)
      }
    } catch (e) {
      res.status(400).send({ message: 'Error in retrieving the list of apartments', api: 'GET/apartments/query', e });
  }
});

// Create a new apartment
router.post('/', authenticate, async (req, res) => {
  try {
    const token = req.header('authorization').split(' ')[1];
    const { body } = req;  
  
    const user = await User.findByToken(token)
    
    const apartment = new Apartment(body);
    apartment.createdBy = user;
    await apartment.save();
    
    res.send({ apartment });
  } catch (e) {
    res.status(400).send({ message: 'Unable to create the apartment', api: 'POST/apartments', e });
  }
});

// UPDATE apartment
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const token = req.header('authorization').split(' ')[1];
    const { id } = req.params;
    const { body } = req;
  
    if (!ObjectID.isValid(id)) return res.status(404).send({ error: 'ObjectID not valid' });
  
    const user = await User.findByToken(token);

    if (!user) res.status(400).send({ error: 'No user found', api: 'POST/rooms' });
    
    const apartment = await Apartment.findByIdAndUpdate(id, {
      $set: body,
      updatedBy: user._id
    }, { new: true });
      
    res.send({ apartment });
  } catch (e) {
    res.status(400).send({ message: 'Error in updating the apartment information', api: `PATCH/apartments/${id}`, e });  
  }
});

// DELETE apartment
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
  
    if (!ObjectID.isValid(id)) return res.status(404).send({ error: 'ObjectID not valid' });
  
    const result = await Apartment.findByIdAndRemove(id);
    
    res.send({ result });
  } catch (e) {
    res.status(400).send({ status: 'error', message: 'Unable to delete the apartment', e });
  }
});

module.exports = router;
