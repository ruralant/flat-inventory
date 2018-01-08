const express = require('express');
const router = express.Router();
const emailHandler = require('../config/email');

router.post('/', (req, res) => {
  emailHandler.sendEmail(req);
  res.status(200).send({message: 'email sent'});
});

module.exports = router;