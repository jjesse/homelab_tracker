const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip + req.user?.id
});

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    req.session.destroy();
    res.status(429).json({
      error: 'Too many login attempts. Account locked for 1 hour.'
    });
  }
});

const secureHeaders = helmet({
  contentSecurityPolicy: false, // Temporarily disable CSP to fix inline JS
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: true,
  frameguard: { action: "deny" },
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
});

module.exports = {
  apiLimiter,
  loginLimiter,
  secureHeaders,
  sanitize: mongoSanitize()
};
