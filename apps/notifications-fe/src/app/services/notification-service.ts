export const notificationService = async ({
  userId,
  body,
}: {
  userId: string;
  body: { data: { title: string; body: string } };
}) => {
  const response = await fetch(`/api/notify/${userId}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failedto notify');
  }

  return response.json();
};
