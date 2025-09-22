import Redis from 'ioredis';
import session from 'express-session';
import RedisStoreImport from 'connect-redis';

const RedisStore = RedisStoreImport.default || RedisStoreImport;

export const redisClient = new Redis({
	host: process.env.REDIS_HOST || 'localhost',
	port: process.env.REDIS_PORT || 6379,
	password: process.env.REDIS_PASSWORD || undefined,
	retryStrategy: (times) => Math.min(times * 50, 2000),
	showFriendlyErrorStack: true
});

redisClient.on('error', (err) => {
	console.error('Redis client error:', err);
});

export const sessionStore = new RedisStore({
	client: redisClient,
	prefix: 'homelab:sess:'
});
