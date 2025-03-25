# Dockerfile based on https://github.com/vercel/next.js/blob/53b5dc6e1780a57b9ae8eaa1aeb3dddc012e241b/examples/with-docker/Dockerfile
# With adjustments to work with PNPM workspaces

FROM node:22-alpine@sha256:9bef0ef1e268f60627da9ba7d7605e8831d5b56ad07487d24d1aa386336d1944 AS base


FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# fix corepack https://github.com/nodejs/corepack/issues/612
RUN npm i -g corepack@latest && corepack enable

ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app
# Copy root workspace and lockfile
COPY .npmrc package.json pnpm-workspace.yaml pnpm-lock.yaml ./
# Copy packages and this app
COPY packages/ ./packages
COPY apps/web ./apps/web

WORKDIR /app/apps/web
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build


# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir -p .next && chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone /app
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# OPTIONAL?: include lockfile in runner for SBOM vulnerability detection
# COPY pnpm-lock.yaml /app

USER nextjs

EXPOSE 3000
ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/web/server.js"]
