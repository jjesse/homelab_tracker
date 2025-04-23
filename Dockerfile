# Build stage
FROM node:latest AS builder

# Install build dependencies based on architecture
RUN case "$(arch)" in \
        x86_64) echo "Installing x86_64 dependencies..." ;; \
        aarch64) echo "Installing ARM64 dependencies..." ;; \
        *) echo "Unsupported architecture" && exit 1 ;; \
    esac

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Runtime stage
FROM node:latest

# Install curl and netcat for health checks based on architecture
RUN apt-get update && \
    case "$(arch)" in \
        x86_64) apt-get install -y curl netcat-traditional ;; \
        aarch64) apt-get install -y curl netcat-traditional ;; \
        *) echo "Unsupported architecture" && exit 1 ;; \
    esac

WORKDIR /app

# Create uploads directory with proper permissions
RUN mkdir -p uploads && \
    chown node:node uploads && \
    chmod 755 uploads

# Copy node modules and other files from builder
COPY --from=builder /app/node_modules ./node_modules
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