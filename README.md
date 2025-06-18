# 📨 Push Notification System

Monorepo built with [Nx](https://nx.dev), containing:

- 🛠️ Notification API using Express, Redis, and RabbitMQ
- 🖼️ React frontend with Web Push Notification support
- 🐳 Docker Compose for complete local infrastructure

## Features

- Web Push subscription management
- Asynchronous message delivery via RabbitMQ
- Subscription storage in Redis
- Service Worker with notification click support

## Project strutucture

```txt
apps/
├── notifications-api/ # Express API (Producer)
├── notifications-fe/ # React App with Service Worker
```

## Getting started

### 1. Requirements

- Node.js >= 20
- Docker + docker compose
- NX cli (optional)
  - `npm install -g nx`

### 2. Generate VAPID keys

```ts
// libs/utils/generate-vapid-keys.ts
import webpush from 'web-push';
console.log(webpush.generateVAPIDKeys());
```

Add the keys to your .env file:

```txt
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

### 3. Start infrastructure

```bash
docker compose up --build
```

Service:

- 🧠 Redis: `http://localhost:6379`
- 📬 RabbitMQ: `http://localhost:5672`
- 📊 RabbitMQ Management: `http://localhost:15672`
  - (user: guest / password: guest)

## Useful commands

- Run the API locally
  - `nx serve notications-api`
- Run the frontend app
  - `nx serve notifications-fe`
