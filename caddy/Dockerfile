FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY frontend/package.json frontend/yarn.lock frontend/.yarnrc.yml ./
RUN yarn install --immutable

COPY frontend/ .
RUN yarn build

FROM caddy:2-alpine

COPY --from=build /app/dist /srv
COPY caddy/Caddyfile /etc/caddy/Caddyfile
