# ==========================================
# Dockerfile - Vite + React Frontend (Development)
# ==========================================
FROM node:22-alpine

WORKDIR /app

# Upgrade npm to latest to handle overrides cleanly
RUN npm install -g npm@latest

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy frontend source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server binding to 0.0.0.0 for container networking
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
