const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const request = require('request');
const mongoose = require('mongoose');

const User = require('../models/userModel');
const { Apartment } = require('../models/apartmentModel');
let { authenticate } = require('./../middleware/auth');


// GET all the apartments
router.get('/', authenticate, (req, res) => {
  const token = req.header('x-auth') || req.session.accessToken;
    
  User.findByToken(token)
    .then(user => {
      // look up for all the apartments created by the current user
      Apartment.find({ createdBy: ObjectID.ObjectId(user._id) })
      .populate('rooms')
      .populate('user')
      .populate('updatedBy')
      .then(apartments => res.send(apartments),
       (e) => res.status(400).send(e));
    });
});

// GET query of apartments
router.get('/query', authenticate, (req, res) => {
  const searchQuery = req.query;
  const limit = parseInt(req.params.limit) || null;
  // in the search term I want to be able to query both query with name or description, then query both with only one. So I take which has been queried and copy that across to query both, plus I query the label with the search term just for wider visibilty
  if (req.query.name || req.query.description) {
    req.query.$or = [];
    req.query.$or.push({
      name: new RegExp(req.query.name || req.query.description, 'i')
    });
    req.query.$or.push({
      name: new RegExp(req.query.name || req.query.description || req.query.location, 'i')
    });
    req.query.$or.push({
      description: new RegExp(req.query.location || req.query.description || req.query.name, 'i')
    });
    req.query.$or.push({
      'label': new RegExp(req.query.description || req.query.name, 'i')
    });
    delete req.query.name;
  }
  const mongoQuery = {
    $and: [{
      // refine search
    }]
  };
  mongoQuery.$and.push(searchQuery);

  Apartment.find(mongoQuery)
    .populate('rooms')
    .populate('user')
    .populate('updatedBy')
    .then(apartments => {
      res.send({ apartments });
    })
    .catch(e => res.status(400).send(e));
});

// Create a new apartment
router.post('/', authenticate, (req, res) => {
  const token = req.header('x-auth') || req.session.accessToken;
  const body = _.pick(req.body, ['_id', 'name', 'description', 'location', 'availability', 'rooms', 'label', 'createdBy', 'updatedBy']);
  
  const apartment = new Apartment(body);

  User.findByToken(token)
    .then(user => {
      apartment.createdBy = user;
      return apartment.save();
    })
    .then(apartment => res.send({ apartment }))
    .catch(e => {
      if (e.error) {
        console.log(e.error.erromsg);
        res.status(400).send(e.error.erromsg);
      } else {
        console.log(e);
        res.status(400).send(e);
      }
    });
});

// UPDATE apartment
router.patch('/:id', authenticate, (req, res) => {
  const token = req.header('x-auth') || req.session.accessToken;
  const id = req.params.id;
  const body = _.pick(req.body, ['name', 'description', 'location', 'availability', 'rooms', 'label', 'createdBy', 'updatedBy']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({ error: "ObjectID not valid" });
  }

  User.findByToken(token)
    .then(user => {
      return Apartment.findByIdAndUpdate(id, {
        $set: body,
        updatedBy: user._id
      }, {
        new: true
      });
    })
    .then(apartment => res.send({ apartment }))
    .catch(e => res.status(400).send(e));
});

// DELETE apartment
router.delete('/:id', authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      error: "ObjectID not valid"
    });
  }

  Apartment.findByIdAndRemove(id)
    .then(() => res.send({ message: "Apartment Deleted" })
    .catch(e => res.status(400).send(e)));
});

module.exports = router;
