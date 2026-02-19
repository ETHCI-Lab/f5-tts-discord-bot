# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache ffmpeg

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application
COPY . .

# Run with npx tsx
CMD ["npx", "tsx", "src/app.ts"]