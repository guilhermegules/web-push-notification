import { useEffect } from 'react';

export function App() {
  const onSubscribeToNotifications = async () => {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers are not supported');
      return;
    }

    navigator.serviceWorker.register('/sw.js').then(async (register) => {
      const publicKey = await fetch('/api/public-key').then((res) =>
        res.text()
      );

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const body = {
        data: {
          title: 'New notification',
          body: 'Content',
        },
        subscription,
      };

      await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  };

  const onUnsubscribeFromPush = async () => {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers are not supported');
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      const success = await subscription.unsubscribe();
      if (success) {
        console.log('User is unsubscribed from push notifications.');

        await fetch('/api/unsubscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        console.warn('User without subscription.');
      }
    } else {
      console.log('User is not subscribed.');
    }
  };

  useEffect(() => {
    onUnsubscribeFromPush();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        navigator.serviceWorker.addEventListener('message', (event) => {
          const data = event.data;
          alert(`📢 ${data.title}\n${data.body}`);
        });
      });
    }
  }, []);

  return (
    <div>
      <h1>React Push Notification Alert</h1>
      <button onClick={onSubscribeToNotifications}>Send notification</button>
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default App;
