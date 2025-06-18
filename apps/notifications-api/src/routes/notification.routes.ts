import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';

export const notificationRoute = Router();

notificationRoute.get('/api/public-key', notificationController.getPublicKey);

notificationRoute.post(
  '/api/subscribe/:userId',
  notificationController.subscribe
);

notificationRoute.post('/api/notify/:userId', notificationController.notify);

notificationRoute.post(
  '/api/unsubscribe/:userId',
  notificationController.unsubscribe
);
