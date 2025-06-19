export const notificationUnsubscribeService = async ({
  userId,
  body,
}: {
  userId: string;
  body: PushSubscription;
}) => {
  const response = await fetch(`/api/unsubscribe/${userId}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Unsubscribe failed');
  }

  return response.json();
};
