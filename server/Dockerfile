FROM oven/bun:latest

WORKDIR /app

# Copy dependency files
COPY package.json bun.lock ./
RUN bun install

# Copy source code
COPY . .

# Cloud Run expects the app to listen on the port defined by $PORT
ENV PORT=8080
EXPOSE 8080

CMD ["bun", "src/index.ts"]
