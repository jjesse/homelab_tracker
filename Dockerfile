# Use Node.js LTS version
FROM node:18

WORKDIR /app

# Install system dependencies for health checks
RUN apt-get update && apt-get install -y \
    curl \
    netcat-traditional \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for now)
RUN npm install && npm cache clean --force

# Copy wait-for-it.sh script first
COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

# Copy application code (node_modules is excluded by .dockerignore)
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Copy wait-for-it.sh to system location (in case the previous copy was overwritten)
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

ENV NODE_ENV=development
ENV PORT=5000

EXPOSE 5000

# Start the application
CMD ["npm", "start"]