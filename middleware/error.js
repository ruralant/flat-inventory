const winston = require('winston');
require('express-async-errors');

module.exports = function (err, req, res, next) {
  winston.error(process.env.NODE_ENV, err.message, err);
  res.status(err.status || 500).send({ message: 'There was a problem', error: err.message });
};