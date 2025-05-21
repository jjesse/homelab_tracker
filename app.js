const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { csrfSync } = require('csrf-sync');
const morgan = require('morgan');
const https = require('https');
const fs = require('fs');
const path = require('path');
const compression = require('compression');
const { apiLimiter, loginLimiter, secureHeaders, sanitize } = require('./middleware/security');
const { errorHandler } = require('./middleware/errorHandler');
const { sessionStore } = require('./config/redis');
const cookieParser = require('cookie-parser'); // Add this line
require('dotenv').config();

const app = express();

// Passport Config
require('./config/passport')(passport);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// CSRF protection
const {
  // invalidCsrfTokenError, // We can use this for custom error handling if needed
  generateToken, // Use this in routes to generate, store, and get a CSRF token if needed before middleware
  // getTokenFromRequest, // Can be customized if token is not in x-csrf-token header
  // getTokenFromState, // Can be customized if token is not in req.session.csrfToken
  // storeTokenInState, // Can be customized for session storage
  // revokeToken, // Can be used to manually revoke tokens
  csrfSynchronisedProtection // The main middleware
} = csrfSync();

// DB Config
const db = process.env.MONGODB_URI;

// Connect to MongoDB with retry logic
const connectWithRetry = () => {
  mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    // Wait 5 seconds before timing out
    socketTimeoutMS: 45000,
    // Close sockets after 45 seconds of inactivity
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

// EJS
app.use(expressLayouts);
app.set('layout', 'layout'); // add this line
app.set('view engine', 'ejs');

// Static Files
app.use(express.static('public'));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Security middleware
app.use(helmet());
app.use(secureHeaders);
app.use(sanitize);
app.use(limiter);
app.use('/api/', apiLimiter);
app.use('/users/login', loginLimiter);

// Add cookie parser before session middleware
app.use(cookieParser());

// Session
app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'fallback_secret_do_not_use_in_production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: 'strict'
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// CSRF protection using csrf-sync
app.use(csrfSynchronisedProtection);

// Middleware to make CSRF token available to views
// This needs to be AFTER csrfSynchronisedProtection so req.csrfToken() is available
app.use((req, res, next) => {
  // If generateToken is preferred or needed before csrfSynchronisedProtection for some routes:
  // res.locals.csrfToken = generateToken(req);
  // Using req.csrfToken() available after the middleware:
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
});

// Performance middleware
app.use(compression());

// Logging middleware
app.use(morgan('dev'));

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ 
      status: 'OK',
      mongodb: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR',
      mongodb: 'Disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/devices', require('./routes/devices'));

// Error handling middleware
app.use(errorHandler);

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// HTTPS Configuration
const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH || path.join(__dirname, 'certs/server.key')),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH || path.join(__dirname, 'certs/server.crt'))
};

const PORT = process.env.PORT || 5000;

// Create HTTPS server
https.createServer(sslOptions, app)
  .listen(PORT, () => console.log(`HTTPS Server running on port ${PORT}`));
