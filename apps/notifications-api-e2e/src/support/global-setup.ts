import { waitForPortOpen } from '@nx/node/utils';
import path from 'path';
import fs from 'fs';
import { GenericContainer } from 'testcontainers';

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
  try {
    // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
    console.log('\nSetting up...\n');

    const REDIS_PORT = process.env.REDIS_PORT
      ? Number(process.env.REDIS_PORT)
      : 6379;

    const redis = await new GenericContainer('redis')
      .withExposedPorts(REDIS_PORT)
      .start();

    const RABBIT_PORT = process.env.RABBITMQ_PORT
      ? Number(process.env.RABBITMQ_PORT)
      : 5672;

    const RABBIT_MANAGEMENT_PORT = process.env.RABBITMQ_MANAGEMENT_PORT
      ? Number(process.env.RABBITMQ_MANAGEMENT_PORT)
      : 15672;

    const rabbit = await new GenericContainer('rabbitmq:3-management')
      .withExposedPorts(RABBIT_PORT, RABBIT_MANAGEMENT_PORT)
      .start();

    const config = {
      REDIS_URL: `redis://${redis.getHost()}:${redis.getMappedPort(
        REDIS_PORT
      )}`,
      RABBITMQ_URL: `amqp://${rabbit.getHost()}:${rabbit.getMappedPort(
        RABBIT_PORT
      )}`,
      RABBITMQ_MANAGEMENT: `http://${rabbit.getHost()}:${rabbit.getMappedPort(
        RABBIT_MANAGEMENT_PORT
      )}`,
    };

    const tempDir = path.join(__dirname, '.tmp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    fs.writeFileSync(
      path.join(tempDir, 'containers.json'),
      JSON.stringify(config)
    );

    const host = process.env.HOST ?? 'localhost';
    const port = process.env.PORT ? Number(process.env.PORT) : 3333;

    await waitForPortOpen(port, { host });

    // Hint: Use `globalThis` to pass variables to global teardown.
    globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
    globalThis.__CONTAINERS__ = { redis, rabbit };
  } catch (error) {
    console.error('Global setup failed');
    console.error(error);
    throw error;
  }
};
