import axios from 'axios';
import { randomUUID } from 'crypto';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3333';

describe('Notifications API (e2e)', () => {
  const userId = randomUUID();

  it('should response with the public key', async () => {
    const res = await axios.get(`${BASE_URL}/api/public-key`);

    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });

  it('should accept a subscription', async () => {
    const fakeSubscription = {
      subscription: {
        endpoint: 'https://fcm.googleapis.com/fake-endpoint',
        keys: {
          p256dh: 'fake-key',
          auth: 'fake-auth',
        },
      },
    };

    const res = await axios.post(
      `${BASE_URL}/api/subscribe/${userId}`,
      fakeSubscription
    );

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
