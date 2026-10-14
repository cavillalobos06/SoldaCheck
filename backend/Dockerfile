# ==========================================
# Dockerfile - NestJS Backend (Development)
# ==========================================
FROM node:22-alpine

WORKDIR /app

# Install native dependencies if required
RUN apk add --no-cache libc6-compat

# Copy package manifests
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy application source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
