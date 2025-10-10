# Use Node.js LTS version with Ubuntu base for better compatibility
FROM node:18

WORKDIR /app

# Install dependencies for health checks
RUN apt-get update && apt-get install -y \
    curl \
    netcat-traditional \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Create uploads directory with proper permissions
RUN mkdir -p uploads && \
    chown node:node uploads && \
    chmod 755 uploads

# Copy application files
COPY . .

# Copy and set permissions for wait-for-it script
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Set proper permissions for copied files
RUN chown -R node:node /app

# Switch to non-root user
USER node

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]