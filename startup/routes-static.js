const error = require('../middleware/error');

const express = require('express');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');

module.exports = function (app) {
  app.use(cors());
  // app.options('*', cors({ origin: true }));

  app.use(logger('dev'));

  app.use(express.static(path.join(__dirname, 'dist')));
  app.use('/assets', express.static('assets'));
  app.use('/assets', express.static(path.join(__dirname, '../media')));

  app.use(error);
};