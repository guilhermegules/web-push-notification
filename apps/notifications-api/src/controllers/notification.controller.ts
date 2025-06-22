import { Request, Response } from 'express';
import { notificationService } from '../services/notification-service';

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

    try {
      await notificationService.subscribe(userId, subscription);

      res.status(201).send({ message: 'Subscribed' });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Internal server error' });
    }
  },
  notify: async (
    req: Request<{
      userId: string;
    }>,
    res: Response
  ) => {
    const { data } = req.body;
    const { userId } = req.params;

    try {
      await notificationService.notify(userId, data);

      res.status(202).send({ message: 'Notification sent' });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Internal server error' });
    }
  },
  unsubscribe: async (
    req: Request<{
      userId: string;
    }>,
    res: Response
  ) => {
    const { userId } = req.params;

    try {
      notificationService.unsubscribe(userId);
      res.status(200).send({ message: 'Unsubscribed successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Internal server error' });
    }
  },
};
