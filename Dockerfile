FROM node:latest

# Install curl and netcat for health checks
RUN apt-get update && apt-get install -y curl netcat-traditional

WORKDIR /app

# Create required directories
RUN mkdir -p certs

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy wait-for-it script and set permissions
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Copy the rest of the application code
COPY . .

# Set proper permissions
RUN chown -R node:node /app

# Switch to non-root user
USER node

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]