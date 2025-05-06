# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install dependencies first (better caching)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:22-alpine
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install production dependencies and @react-router/dev
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod && \
    pnpm add @react-router/dev

# Copy built assets from builder
COPY --from=builder --chown=appuser:appgroup /app/build ./build

# Set proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "start"]