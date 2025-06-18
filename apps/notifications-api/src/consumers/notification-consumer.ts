import webpush from 'web-push';
import { getChannel, NOTIFICATION_QUEUE_NAME } from '../infra/rabbitmq';
import { redisClient } from '../infra/redis';

webpush.setVapidDetails(
  'mailto:you@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function startNotificationConsumer() {
  const channel = await getChannel();

  channel.consume(
    NOTIFICATION_QUEUE_NAME,
    async (msg) => {
      if (!msg) return;

      const { userId, title, body } = JSON.parse(msg.content.toString());

      const subscription = await redisClient.get(`push:${userId}`);

      if (!subscription) {
        console.warn(`Subscription not found for user ${userId}`);
        channel.ack(msg);
        return;
      }

      try {
        await webpush.sendNotification(
          JSON.parse(subscription as string),
          JSON.stringify({ title, body })
        );
        console.log(`Sent to user ${userId}`);
        channel.ack(msg);
      } catch (error) {
        console.error(`Notification error: `, error.statusCode, error.message);
        if (error.statusCode === 404) {
          await redisClient.del(`push:${userId}`);
        }
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
}

startNotificationConsumer();
