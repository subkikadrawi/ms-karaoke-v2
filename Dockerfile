# ---------- Stage 1: Build ----------
FROM node:23-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-scripts

COPY . .

# Compile TypeScript -> build/
RUN npm run build

# ---------- Stage 2: Production ----------
FROM node:23-slim

WORKDIR /app

# Copy only what’s needed
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=production
EXPOSE 5500

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "build/src/index.js"]