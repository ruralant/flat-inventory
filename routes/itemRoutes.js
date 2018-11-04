const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

const User = require('../models/userModel');
const { Item } = require('../models/itemModel');
let { authenticate } = require('./../middleware/auth');

// GET all the Items
router.get('/', authenticate, async (req, res) => {
  try {
    const items = await Item.find().populate('apartment').populate('user');
    res.send({ message: 'List of items', items});
  } catch (e) {
    res.status(400).send({ error: 'Unable to fetch the items', e});
  }
});

// GET query of Items
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
    const mongoQuery = {
      $and: [{ }]
    };
    mongoQuery.$and.push(searchQuery);
  
    const items = Item.find(mongoQuery).populate('apartment').populate('user');
    res.send({ message: 'Successful query: List of items', items });
  } catch (e) {
    res.status(400).send({ error: 'Unable to run the query', e});
  }
});

// Create a new item
router.post('/', authenticate, async (req, res) => {
  try {
    const token = req.header('x-auth') || req.session.accessToken;
    const { body } = req;
    
    let item = new Item(body);
  
    const user = User.findByToken(token);
    item.createdBy = user;
    await item.save();
    //   findByIdAndUpdate(item.location)
    res.send({ message: 'New item successfully created', item });
  } catch (e) {
    res.status(400).send({ error: 'New item not created', e});
  }
});

// UPDATE item
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const token = req.header('x-auth') || req.session.accessToken;
    const { id } = req.params;
    const { body } = req;
  
    if (!ObjectID.isValid(id)) {
      return res.status(404).send({ error: 'ObjectID not valid' });
    }
  
    const user = await User.findByToken(token);
    const item = await Item.findByIdAndUpdate(id, { $set: body, updatedBy: user._id }, { new: true });
    
    res.send({ message: 'Item updated successfully', item });
  } catch (e) {
    res.status(400).send({ error: 'Unable to update the item', e});
  }
});

// DELETE item
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
  
    if (!ObjectID.isValid(id)) {
      return res.status(404).send({ error: 'ObjectID not valid' });
    }
  
    const result = await Item.findByIdAndRemove(id);
    res.send({ message: 'Item deleted successfully', result });
  } catch (e) {
    res.status(400).send({ error: 'Unable to delete the item', e});
  }
});

module.exports = router;
