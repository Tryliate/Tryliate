
# 1. Base image
FROM oven/bun:1.3.5 AS base

# 2. Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public

# Environment variables required during build time
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_CLOUD_RUN_URL
ARG NEXT_PUBLIC_ENGINE_URL
ARG NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_CLOUD_RUN_URL=$NEXT_PUBLIC_CLOUD_RUN_URL
ENV NEXT_PUBLIC_ENGINE_URL=$NEXT_PUBLIC_ENGINE_URL
ENV NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY=$NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID=$NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID
ENV NEXT_TELEMETRY_DISABLED 1
ENV TURBO_TELEMETRY_DISABLED 1

RUN bun run build || (echo "Build failed, showing logs..." && exit 1)

# 4. Runner
FROM node:25-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

# Create simple user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
