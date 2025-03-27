FROM node:latest

WORKDIR /app

# Create required directories
RUN mkdir -p certs

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

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
