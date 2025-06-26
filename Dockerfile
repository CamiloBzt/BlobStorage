FROM azeupvprddvoacr01.azurecr.io/node:18-alpine AS base
FROM base AS deps

WORKDIR /app

COPY package.json ./
COPY .npmrc .npmrc

RUN npm install --verbose
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG ENV_NODE
ENV ENV_NODE=$ENV_NODE
RUN echo "El valor de mi ENV_NODE: $ENV_NODE"
COPY ${ENV_NODE} .env.production

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE ${PORT}

ENV PORT ${PORT}

CMD ["node", "server.js"]