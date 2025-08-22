# Stage 1: build with Nx
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npx nx build notifications-api

# Stage 2: run
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/notifications-api ./dist
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
