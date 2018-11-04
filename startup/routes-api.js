const error = require('../middleware/error');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const index = require('./routes/index');
const user = require('./routes/userRoutes');
const room = require('./routes/roomRoutes');
const item = require('./routes/itemRoutes');
const apartment = require('./routes/apartmentRoutes');

module.exports = function (app) {
  if (process.env.ISDEBUG) app.use(logger('dev'));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cors());

  app.use('/', index);
  app.use('/api/users', user);
  app.use('/api/rooms', room);
  app.use('/api/items', item);
  app.use('/api/apartments', apartment);

  app.use(error);
};
