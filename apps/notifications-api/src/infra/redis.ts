import { createClient } from 'redis';

export const redisClient = createClient();

redisClient.on('error', (error) => console.error('Redis Client Error', error));

export async function redisClientConnector() {
  await redisClient.connect();
}
