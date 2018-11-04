require('./config/config');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

require('./startup/db')();
require('./startup/routes-static');
require('./startup/routes-api');

// PM2 stats config
require('pmx').init({
  http : true,
  errors : true,
  custom_probes : true,
  network : true,
  ports : true
});


module.exports = app;