const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const { errorHandler } = require('./middleware/errorHandler');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const compression = require('compression');
const methodOverride = require('method-override');
const { apiLimiter, loginLimiter, secureHeaders, sanitize } = require('./middleware/security');
// const { sessionStore } = require('./config/redis');
const cookieParser = require('cookie-parser');
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

// DB Config
const db = process.env.MONGODB_URI || '';

// Connect to MongoDB with retry logic
const connectWithRetry = () => {
  mongoose.connect(db, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

// EJS
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');

// Static Files
app.use(express.static('public'));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Method override for PUT/DELETE
app.use(methodOverride('_method'));

// Security middleware - TEMPORARILY DISABLED FOR DEBUGGING
// app.use(helmet());
// app.use(secureHeaders);
// app.use(sanitize);
app.use(limiter);
app.use('/api/', apiLimiter);
app.use('/users/login', loginLimiter);

// Add cookie parser before session middleware
app.use(cookieParser());

// Session (using memory store for testing - replace with Redis in production)
app.use(session({
  // store: sessionStore, // Disabled for testing
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

// CSRF protection with proper cookie config - TEMPORARILY DISABLED
// app.use(csrf({
//   cookie: {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict'
//   }
// }));

app.use((req, res, next) => {
  res.locals.csrfToken = 'disabled'; // Temporary placeholder
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
app.use('/categories', require('./routes/categories'));

// Error handling middleware
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

// Create server (HTTPS if certificates available, HTTP otherwise)
const server = (() => {
  if (process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
    try {
      const options = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH)
      };
      console.log('SSL certificates found, starting HTTPS server...');
      return https.createServer(options, app);
    } catch (err) {
      console.log('SSL certificates not found or invalid, falling back to HTTP');
      console.log('Error:', err.message);
      return http.createServer(app);
    }
  } else {
    console.log('No SSL configuration found, starting HTTP server...');
    return http.createServer(app);
  }
})();

server.listen(PORT, () => {
  const protocol = server instanceof https.Server ? 'HTTPS' : 'HTTP';
  console.log(`${protocol} Server running on port ${PORT}`);
});

module.exports = app;