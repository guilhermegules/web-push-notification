import express from 'express';
import bodyParser from 'body-parser';
import { redisClientConnector } from './infra/redis';
import './consumers/notification-consumer';
import { notificationRoute } from './routes/notification.routes';

const app = express();
app.use(bodyParser.json());

app.use(notificationRoute);

const port = process.env.PORT;

const server = app.listen(port, async () => {
  await redisClientConnector();
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
