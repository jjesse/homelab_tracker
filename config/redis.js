const Redis = require('ioredis');
const session = require('express-session');
const RedisStore = require('connect-redis').default;

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 50, 2000)
});

const sessionStore = new RedisStore({ 
  client: redisClient,
  prefix: 'homelab:sess:'
});

module.exports = {
  redisClient,
  sessionStore
};
