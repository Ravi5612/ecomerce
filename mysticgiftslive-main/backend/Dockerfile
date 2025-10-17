# Start with a small but safe base
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install only production deps
RUN npm install --production

# Copy the rest of your source
COPY . .

# Cloud Run expects the app to listen on PORT env
ENV PORT=8080
EXPOSE 8080

# Start your server
CMD ["node", "server.js"]