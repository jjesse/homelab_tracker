import Redis from 'ioredis';
import session from 'express-session';
import RedisStoreImport from 'connect-redis';

const RedisStore = (RedisStoreImport as any).default || RedisStoreImport;

export const redisClient: Redis = new Redis({
	host: process.env.REDIS_HOST || 'localhost',
	port: Number(process.env.REDIS_PORT) || 6379,
	password: process.env.REDIS_PASSWORD || undefined,
	retryStrategy: (times: number) => Math.min(times * 50, 2000),
	showFriendlyErrorStack: true
});

redisClient.on('error', (err: Error) => {
	console.error('Redis client error:', err);
});

export const sessionStore = new RedisStore({
	client: redisClient,
	prefix: 'homelab:sess:'
});
