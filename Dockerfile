# Use Node.js LTS version as base image
FROM node:18-alpine AS base

# Create app directory
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps
RUN npx prisma db push

# Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all files and run next
FROM base AS runner
ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permissions
COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown -R nextjs:nodejs .next

# Set working directory and user
WORKDIR /app
USER nextjs

# Copy built app
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 