const express = require('express');
const router = express.Router();
const emailHandler = require('../config/email');

router.post('/', async (req, res) => {
  try {
    await emailHandler.sendEmail(req);
    res.status(200).send({ message: 'email sent' });
  } catch (e) {
    res.status(400).send({ message: 'Error in sending the email', api: 'POST/email', e })
  }
});

module.exports = router;