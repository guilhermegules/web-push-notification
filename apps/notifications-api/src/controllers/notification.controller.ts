import { Request, Response } from 'express';
import { redisClient } from '../infra/redis';
import { randomUUID } from 'crypto';
import { getChannel, NOTIFICATION_QUEUE_NAME } from '../infra/rabbitmq';

export const notificationController = {
  getPublicKey: (req: Request, res: Response) => {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    res.send(publicKey);
  },
  subscribe: async (
    req: Request<{
      userId: string;
    }>,
    res: Response
  ) => {
    const { subscription } = req.body;
    const { userId } = req.params;

    await redisClient.set(`push:${userId}`, JSON.stringify(subscription));

    res.status(200).send('Subscribed');
  },
  notify: async (
    req: Request<{
      userId: string;
    }>,
    res: Response
  ) => {
    const { data } = req.body;
    const { userId } = req.params;

    const payload = {
      id: randomUUID(),
      userId,
      title: data.title,
      body: data.body,
    };

    const channel = await getChannel();

    channel.sendToQueue(
      NOTIFICATION_QUEUE_NAME,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
      }
    );

    res.status(202).send('Notification sent');
  },
  unsubscribe: async (
    req: Request<{
      userId: string;
    }>,
    res: Response
  ) => {
    const { userId } = req.params;

    await redisClient.del(`push:${userId}`);

    res.status(200).send('Unsubscribed successfully');
  },
};
