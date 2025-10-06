# syntax=docker/dockerfile:1

# -------- Build stage --------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

COPY src ./src

RUN npm run build

# -------- Runtime stage --------
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Ensure uploads dir exists at runtime
RUN mkdir -p uploads/images

# Only install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output from build stage
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]


