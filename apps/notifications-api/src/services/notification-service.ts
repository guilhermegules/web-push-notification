import { randomUUID } from 'crypto';
import { getChannel, NOTIFICATION_QUEUE_NAME } from '../infra/rabbitmq';
import { redisClient } from '../infra/redis';
import { logger } from '../infra/logger';

export const notificationService = {
  subscribe: async (userId: string, subscription: PushSubscription) => {
    await redisClient.set(`push:${userId}`, JSON.stringify(subscription));
  },
  notify: async (userId: string, data: { title: string; body: string }) => {
    const payload = {
      id: randomUUID(),
      userId,
      title: data.title,
      body: data.body,
    };

    logger.info(payload);

    const channel = await getChannel();

    channel.sendToQueue(
      NOTIFICATION_QUEUE_NAME,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
      }
    );
  },
  unsubscribe: async (userId: string) => {
    await redisClient.del(`push:${userId}`);
  },
};
