import { useEffect, useState } from 'react';
import { Toast } from './toast';
import { v4 as uuidv4 } from 'uuid';

const userId = uuidv4();

export function App() {
  const [toast, setToast] = useState({ open: false, message: '' });

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
        subscription,
      };

      await fetch(`/api/subscribe/${userId}`, {
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

  const onClickNotify = async () => {
    const body = {
      data: {
        title: 'New notification',
        body: 'Content',
      },
    };

    await fetch(`/api/notify/${userId}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  useEffect(() => {
    onUnsubscribeFromPush();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        navigator.serviceWorker.addEventListener('message', (event) => {
          const data = event.data;
          setToast({
            open: true,
            message: `📢 ${data.title} - ${data.body}`,
          });
        });
      });
    }
  }, []);

  return (
    <div className="bg-slate-600 h-screen flex items-center justify-center">
      <div>
        <h1 className="text-slate-100 mb-4 text-4xl">
          React Push Notification Alert
        </h1>
        <div className="flex gap-2">
          <button
            onClick={onSubscribeToNotifications}
            className="text-slate-100 p-2 border-x-2 border-y-2 rounded-sm"
          >
            Subscribe to notifications
          </button>
          <button
            onClick={onClickNotify}
            className="text-slate-100 p-2 border-x-2 border-y-2 rounded-sm"
          >
            Please notify me!
          </button>
        </div>
      </div>

      {toast.open && (
        <Toast
          message={toast.message}
          onClose={() => {
            setToast({
              open: false,
              message: '',
            });
          }}
          duration={2000}
        />
      )}
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
