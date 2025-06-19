export const notificationSubscribeService = async ({
  userId,
  body,
}: {
  userId: string;
  body: { subscription: PushSubscription };
}) => {
  const response = await fetch(`/api/subscribe/${userId}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to subscribe');
  }

  return response.json();
};
