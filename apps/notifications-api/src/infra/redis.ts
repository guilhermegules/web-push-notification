import { createClient } from 'redis';
import { logger } from './logger';

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (error) => console.error('Redis Client Error', error));

export async function redisClientConnector() {
  await redisClient.connect();
  logger.info('✅ Connected to Redis');
}
