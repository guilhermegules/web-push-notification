import { useEffect } from 'react';
import { urlBase64ToUint8Array } from '../utils/base64';
import { useMutation } from '@tanstack/react-query';
import { notificationSubscribeService } from '../services/notification-subscribe-service';
import { notificationService } from '../services/notification-service';
import { notificationUnsubscribeService } from '../services/notification-unsubscribe-service';

type UseNotificationProps = {
  userId: string;
  toastAction: (message: string) => void;
};

export const useNotification = ({
  userId,
  toastAction,
}: UseNotificationProps) => {
  const notificationSubscribeMutation = useMutation({
    mutationFn: notificationSubscribeService,
  });

  const notificationMutation = useMutation({
    mutationFn: notificationService,
  });

  const notificationUnsubscribeMutation = useMutation({
    mutationFn: notificationUnsubscribeService,
  });

  const onSubscribe = async () => {
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

      notificationSubscribeMutation.mutate({
        userId,
        body,
      });
    });
  };

  const onNotify = async (data: { title: string; body: string }) => {
    const body = {
      data,
    };

    notificationMutation.mutate({ body, userId });
  };

  const onUnsubscribe = async () => {
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

        notificationUnsubscribeMutation.mutate({
          userId,
          body: subscription,
        });
      } else {
        console.warn('User without subscription.');
      }
    } else {
      console.log('User is not subscribed.');
    }
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        navigator.serviceWorker.addEventListener('message', (event) => {
          const data = event.data;
          toastAction(`📢 ${data.title} - ${data.body}`);
        });
      });
    }
  }, [toastAction]);

  return {
    onNotify,
    onSubscribe,
    onUnsubscribe,
  };
};
