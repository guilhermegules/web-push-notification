import express from 'express';
import webpush from 'web-push';
import bodyParser from 'body-parser';
import { connectQueue, NOTIFICATION_QUEUE_NAME } from './infra/rabbitmq';
import { redisClient, redisClientConnector } from './infra/redis';
import { randomUUID } from 'crypto';
import './consumers/notification-consumer';

const app = express();
app.use(bodyParser.json());

let channel: Awaited<ReturnType<typeof connectQueue>>;

app.get('/api/public-key', (req, res) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  res.send(publicKey);
});

app.post('/api/subscribe/:userId', async (req, res) => {
  const { subscription } = req.body;
  const { userId } = req.params;

  await redisClient.set(`push:${userId}`, JSON.stringify(subscription));

  res.status(200).send('Subscribed');
});

app.post('/api/notify/:userId', async (req, res) => {
  const { data } = req.body;
  const { userId } = req.params;

  const payload = {
    id: randomUUID(),
    userId,
    title: data.title,
    body: data.body,
  };

  await channel.sendToQueue(
    NOTIFICATION_QUEUE_NAME,
    Buffer.from(JSON.stringify(payload)),
    {
      persistent: true,
    }
  );

  res.status(202).send('Notification sent');
});

app.post('/api/unsubscribe', (req, res) => {
  const subscription = req.body;

  console.log('Unsubscribed:', subscription);

  res.status(200).send('Unsubscribed successfully');
});

const port = process.env.PORT || 3333;

const server = app.listen(port, async () => {
  channel = await connectQueue();
  await redisClientConnector();
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
