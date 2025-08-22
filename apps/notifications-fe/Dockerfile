# Stage 1: build with Nx
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npx nx build notifications-fe

# Stage 2: serve with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist/apps/notifications-fe /usr/share/nginx/html
COPY apps/notifications-fe/nginx.conf /etc/nginx/conf.d/default.conf
