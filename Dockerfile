FROM node:22.14-bookworm-slim AS builder

WORKDIR /usr/src/app

# Copy and install dependencies first
COPY package.json package-lock.json ./
RUN npm install

# Copy source files and build
COPY ./src ./src
COPY tsconfig.json ./
RUN npm run build

FROM node:22.14-bookworm-slim

WORKDIR /usr/src/app

# Copy built files from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production

EXPOSE 3000

ENTRYPOINT ["npm", "start"]