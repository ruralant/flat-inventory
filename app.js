require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cors = require('cors');

const index = require('./routes/index');
const user = require('./routes/userRoutes');
const room = require('./routes/roomRoutes');
const item = require('./routes/itemRoutes');
const apartment = require('./routes/apartmentRoutes');

const app = express();

//mongodb connection
mongoose.Promise = global.Promise;
mongoose.set('debug', true); //show all the mongo queries on the console
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true }, (err) => {
  err ? console.log(err) : console.log('Connected to mongodb.');
});

// some extra pm2 stats switched on here
require('pmx').init({
  http : true,
  errors : true,
  custom_probes : true,
  network : true,
  ports : true
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/assets', express.static('assets'));
app.use('/assets', express.static(path.join(__dirname, '../media')));
app.use(cors());
app.options('*', cors());

//Handle Express Sessions/cookies
let store = new MongoStore({
  url: process.env.MONGODB_SESSION,
  collection: 'sessions',
  ttl: 1 * 12 * 60 * 60 // = 12 hours
});

// Catch errors
store.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: true,
  store
}));

app.use('/', index);
app.use('/api/users', user);
app.use('/api/rooms', room);
app.use('/api/items', item);
app.use('/api/apartments', apartment);

app.use('/public', express.static(path.join(__dirname, './media')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

// 404 errors forwarded to the Error Handler function 
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handler
app.use((err, req, res) => {
  // error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // rendering the error page
  res.status(err.status || 500);
  console.log(err);
  res.send({ message: err.message });
});

module.exports = app;