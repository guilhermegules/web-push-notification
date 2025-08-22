import pino from 'pino';
import pinoLoki from 'pino-loki';

const stream = pinoLoki({
  batching: true,
  interval: 5,
  host: 'http://loki:3100',
  labels: { app: 'notifications-api' },
});

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    transport:
      process.env.NODE_ENV === 'development'
        ? { target: 'pino-pretty' }
        : undefined,
  },
  stream
);
