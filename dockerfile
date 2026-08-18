FROM node:22-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml prisma.config.ts ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

ARG DATABASE_URL

RUN npx prisma generate

RUN pnpm run build

FROM node:20-alpine AS runtime

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/src/database/schema.prisma ./src/database/schema.prisma
COPY --from=builder /app/src/database/migrations ./src/database/migrations

ARG DATABASE_URL

RUN npx prisma generate

EXPOSE 8080

CMD npx prisma migrate deploy && node dist/src/main.js