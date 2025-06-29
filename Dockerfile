FROM node:lts-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn run build

# 빌드 결과 확인
RUN echo "=== 빌드 후 .next 구조 ===" && ls -la .next/
RUN echo "=== standalone 폴더 확인 ===" && ls -la .next/standalone/ || echo "standalone 폴더 없음"
RUN echo "=== server.js 확인 ===" && ls -la .next/standalone/server.js || echo "server.js 없음"

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 복사 후 파일 확인
RUN echo "=== 복사 후 루트 디렉토리 ===" && ls -la
RUN echo "=== server.js 존재 확인 ===" && ls -la server.js || echo "server.js 복사 안됨"

EXPOSE 8080
ENV PORT 8080
ENV HOSTNAME "0.0.0.0"
CMD ["node", "server.js"]