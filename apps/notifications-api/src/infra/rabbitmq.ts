import amqp, { Channel, ChannelModel } from 'amqplib';

export const NOTIFICATION_QUEUE_NAME = 'notifications';
export const RABBITMQ_URL = process.env.RABBITMQ_URL;

let channel: Channel | null = null;
let connection: ChannelModel | null = null;

export async function getChannel(): Promise<Channel> {
  if (channel) return channel;

  if (!connection) {
    connection = await amqp.connect(RABBITMQ_URL);
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
      connection = null;
      channel = null;
    });

    connection.on('close', () => {
      console.warn('RabbitMQ connection closed');
      connection = null;
      channel = null;
    });
  }

  channel = await connection.createChannel();
  await channel.assertQueue(NOTIFICATION_QUEUE_NAME, { durable: true });

  return channel;
}
