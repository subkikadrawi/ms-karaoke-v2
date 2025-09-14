# ---------- Stage 1: Build ----------
  FROM node:20.19.2-slim AS builder

  # Set working directory
  WORKDIR /app

  # Install dependencies
  COPY package*.json ./
  RUN npm install

  # Copy the rest of the app
  COPY . .

  # Build TypeScript or other
  RUN npm run build

  # ---------- Stage 2: Production ----------
  FROM node:20.19.2-slim

  WORKDIR /app

  COPY --from=builder /app/build ./build
  COPY --from=builder /app/node_modules ./node_modules
  COPY --from=builder /app/package*.json ./


  ENV NODE_ENV=production
  EXPOSE 8016

  CMD ["node", "build/src/index.js"]
