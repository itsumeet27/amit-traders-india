# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Optional bake-in defaults (Railway can still override at runtime via entrypoint)
ARG VITE_API_BASE_URL=
ARG VITE_SITE_URL=
ARG VITE_DEMO_MODE=false
ARG VITE_BASE_PATH=/
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_SITE_URL=$VITE_SITE_URL \
    VITE_DEMO_MODE=$VITE_DEMO_MODE \
    VITE_BASE_PATH=$VITE_BASE_PATH
RUN npm run build

FROM caddy:2.9-alpine
WORKDIR /app
COPY Caddyfile /app/Caddyfile
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
COPY --from=build /app/dist /app/dist
RUN chmod +x /app/docker-entrypoint.sh \
  && caddy fmt --overwrite /app/Caddyfile
EXPOSE 3000
ENTRYPOINT ["/app/docker-entrypoint.sh"]
