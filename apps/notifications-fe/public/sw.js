this.addEventListener('push', (event) => {
  const data = event.data.json();

  this.registration.showNotification(data.title, {
    body: data.body,
  });

  this.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage(data);
    });
  });
});
