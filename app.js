const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = 'mongodb://localhost:27017/homelab';

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Helmet middleware
app.use(helmet());

// Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// SSL options
const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH || './certs/server.key'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH || './certs/server.crt')
};

const PORT = process.env.PORT || 5000;

https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server started on port ${PORT}`);
});
