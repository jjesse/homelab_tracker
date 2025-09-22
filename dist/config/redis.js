// Example TypeScript config module for Redis
import Redis from 'ioredis';
export const redisClient = new Redis();
import RedisStoreImport from 'connect-redis';
const RedisStore = RedisStoreImport.default || RedisStoreImport;
export const sessionStore = new RedisStore({
    client: redisClient,
    prefix: 'homelab:sess:'
});
