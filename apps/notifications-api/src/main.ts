import express from 'express';
import webpush from 'web-push';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  'mailto:guilhermegules@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
webpush.setGCMAPIKey('<Your GCM API Key Here>');

app.get('/api/public-key', (req, res) => {
  res.send(vapidKeys.publicKey);
});

app.post('/api/subscribe', (req, res) => {
  const { subscription, data } = req.body;

  console.log(req.body);

  const payload = JSON.stringify({
    title: data.title,
    body: data.body,
  });

  webpush
    .sendNotification(subscription, payload)
    .then(() => res.status(200).send('Notification sent'))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Notification not sent');
    });
});

app.post('/api/unsubscribe', (req, res) => {
  const subscription = req.body;

  console.log('Unsubscribed:', subscription);

  res.status(200).send('Unsubscribed successfully');
});

const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
