const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

const User = require('../models/userModel');
const { Item } = require('../models/itemModel');
let { authenticate } = require('./../middleware/auth');

// GET all the Items
router.get('/', authenticate, (req, res) => {
  Item.find()
    .populate('apartment')
    .populate('user')
    .then(items => {
      res.send(items);
    }, (e) => res.status(400).send(e));
});

// GET query of Items
router.get('/query', authenticate, (req, res) => {
  const searchQuery = req.query;
  // in the search term I want to be able to query both query with name or description, then query both with only one. So I take which has been queried and copy that across to query both, plus I query the label with the search term just for wider visibilty
  if (req.query.name || req.query.description) {
    req.query.$or = [];
    req.query.$or.push({ name: new RegExp(req.query.name || req.query.description, 'i') });
    req.query.$or.push({ description: new RegExp(req.query.description || req.query.name, 'i') });
    req.query.$or.push({ 'label': new RegExp(req.query.description || req.query.name, 'i') });
    delete req.query.name;
  }
  const mongoQuery = {
    $and: [{
      // refine search
    }]
  };
  mongoQuery.$and.push(searchQuery);

  Item.find(mongoQuery)
    .populate('apartment')
    .populate('user')
    .then(items => res.send({ items }))
    .catch(e => res.status(400).send(e));
});

// Create a new item
router.post('/', authenticate, (req, res) => {
  const token = req.header('x-auth') || req.session.accessToken;
  const { body } = req;
  
  const item = new Item(body);

  User.findByToken(token)
    .then(user => {
      item.createdBy = user;
      return item.save();
    })
    // .then(item => {
    //   findByIdAndUpdate(item.location)
    // })
    .then(item => res.send({ item }))
    .catch(e => {
      e.error ? res.status(400).send(e.error.erromsg) : res.status(400).send(e);
    });
});

// UPDATE item
router.patch('/:id', authenticate, (req, res) => {
  const token = req.header('x-auth') || req.session.accessToken;
  const { id } = req.params;
  const { body } = req;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({ error: 'ObjectID not valid' });
  }

  User.findByToken(token)
    .then(user => {
      return Item.findByIdAndUpdate(id, {
        $set: body,
        updatedBy: user._id
      }, { new: true });
    })
    .then(item => res.send({ item }))
    .catch(e => res.status(400).send(e));
});

// DELETE item
router.delete('/:id', authenticate, (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({ error: 'ObjectID not valid' });
  }

  Item.findByIdAndRemove(id)
    .then(() => res.send({ message: 'Item Deleted' })
    .catch(e => res.status(400).send(e)));
});

module.exports = router;
