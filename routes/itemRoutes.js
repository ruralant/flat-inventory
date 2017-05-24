const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const request = require('request');
const mongoose = require('mongoose');

const { Item } = require('../models/itemModel');

// GET all the Items
router.get('/', (req, res) => {
    Item.find()
    .populate('apartment')
    .then(items => {
        res.send(items);
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET query Items
router.get('/query', (req, res) => {
  const searchQuery = req.query;
  const limit = parseInt(req.params.limit) || null;
  // in the search term I want to be able to query both query with name or description, then query both with only one. So I take which has been queried and copy that across to query both, plus I query the label with the search term just for wider visibilty
  if (req.query.name || req.query.description) {
    req.query.$or = [];
    req.query.$or.push({
      name: new RegExp(req.query.name || req.query.description, 'i')
    });
    req.query.$or.push({
      description: new RegExp(req.query.description || req.query.name, 'i')
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

  Instance.find(mongoQuery)
    .populate('apartment')
    .then(rooms => {
      res.send({
        items
      });
    }).catch(e => res.status(400).send(e));
});

// Create a new item
router.post('/', (req, res) => {
    const token = req.header('x-auth') || req.session.accessToken;
    const body = _.pick(req.body, ['_id', 'name', 'description', 'location', 'quantity', 'label', 'createdBy', 'updatedBy']);
    
    const item = new Item(body);

    User.findByToken(token)
    .then(user => {
        item.createdBy = user;
        return item.save();
    })
    .populate('apartment')
    .then(item => {
        res.send({ item });
    })
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



module.exports = router;
