FROM node:22.14-bookworm-slim AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY ./src ./src
RUN npm run build

FROM node:22.14-bookworm-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package.json package-lock.json ./

RUN npm install --omit=dev

EXPOSE 3000

ENTRYPOINT ["node", "dist/server.js"]