# syntax=docker.io/docker/dockerfile:1

FROM node:lts-alpine3.23

WORKDIR /app

# Install dependencies using pnpm
COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN corepack enable pnpm && pnpm install

# Copy application files
COPY src ./src
COPY public ./public
COPY next.config.ts .
COPY tsconfig.json .
COPY postcss.config.mjs .
COPY generated ./generated
COPY prisma ./prisma
COPY prisma.config.ts .

# Start Next.js in development mode
CMD pnpm dev
