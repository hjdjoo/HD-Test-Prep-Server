FROM node:22.14-bookworm-slim

WORKDIR /usr/src/server

COPY ./src /usr/src/server
COPY ./nginx /usr/src/nginx

RUN npm install

RUN 