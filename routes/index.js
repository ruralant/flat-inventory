const express = require('express');
const router = express.Router();
const path = require('path');

// the overall dashboard page
router.get('/', (req, res) => {
  if(!req.header('authorization').split(' ')[1]) {
    res.redirect('/login');
  } else {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  }
});

module.exports = router;