import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';

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
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
			styleSrc: ["'self'", "'unsafe-inline'"],
			imgSrc: ["'self'", 'data:', 'https:'],
			connectSrc: ["'self'"],
			fontSrc: ["'self'"],
			objectSrc: ["'none'"],
			mediaSrc: ["'self'"],
			frameSrc: ["'none'"],
		}
	},
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

const sanitize = mongoSanitize();

export { apiLimiter, loginLimiter, secureHeaders, sanitize };
