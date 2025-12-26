FROM oven/bun:latest

WORKDIR /app

COPY package.json ./
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
RUN bun install
RUN bun add drizzle-orm @upstash/redis groq-sdk

COPY . .

EXPOSE 8080

CMD ["bun", "run", "src/index.ts"]
