import axios from 'axios';
import { createECDH, randomBytes, randomUUID } from 'crypto';
import base64url from 'base64url';
import path from 'path';
import fs from 'fs';
import { createClient } from 'redis';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3333';

const config = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../support/.tmp/containers.json'),
    'utf-8'
  )
);

function createTestSubscription(vapidPublicKey: string) {
  const ecdh = createECDH('prime256v1');
  ecdh.generateKeys();

  const p256dh = base64url.encode(ecdh.getPublicKey());
  const auth = base64url.encode(randomBytes(16));

  return {
    subscription: {
      endpoint: 'https://fcm.googleapis.com/fcm/send/fake-token',
      keys: {
        p256dh,
        auth,
      },
    },
  };
}

describe('Notifications API (e2e)', () => {
  const userId = randomUUID();

  it('should response with the public key', async () => {
    const res = await axios.get(`${BASE_URL}/api/public-key`);

    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });

  it('should accept a subscription', async () => {
    const keyRes = await axios.get(`${BASE_URL}/api/public-key`);
    const publicKey = keyRes.data;

    const fakeSubscription = createTestSubscription(publicKey);

    const res = await axios.post(
      `${BASE_URL}/api/subscribe/${userId}`,
      fakeSubscription
    );

    const client = createClient({ url: config.redisUrl });
    await client.connect();

    const redisKey = `push:${userId}`;
    const value = await client.get(redisKey);

    expect(value).toBeTruthy();
    const parsed = JSON.parse(value as string);
    expect(parsed.endpoint).toContain('https://fcm.googleapis.com');

    client.destroy();

    expect(res.status).toBe(201);
  });

  it('should queue a notification', async () => {
    const res = await axios.post(`${BASE_URL}/api/notify/${userId}`, {
      data: {
        title: 'Test Notification',
        body: 'This is a test.',
      },
    });

    expect(res.status).toBe(202);
  });
});
