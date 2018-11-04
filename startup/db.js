const mongoose = require('mongoose');
const winston = require('winston');

module.exports = () => {
  mongoose.Promise = global.Promise;

  mongoose.set('useFindAndModify', false);
  if (process.env.ISDEBUG) mongoose.set('debug', true);

  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err) => {
    if (err) {
      winston.info(err);
    } else {
      winston.info('Connected to mongodb.');
    }
  });
};