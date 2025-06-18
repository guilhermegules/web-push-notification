import amqp from 'amqplib';

export const NOTIFICATION_QUEUE_NAME = 'notifications';

export async function connectQueue() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(NOTIFICATION_QUEUE_NAME, { durable: true });

  return channel;
}
