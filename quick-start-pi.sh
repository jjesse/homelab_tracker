#!/bin/bash

# Homelab Tracker - Raspberry Pi Docker Quick Start
# This script sets up the entire application using Docker on Raspberry Pi

set -e

echo "🍓🐳 Homelab Tracker - Raspberry Pi Docker Setup"
echo "==============================================="

# Check architecture
ARCH=$(uname -m)
echo "Detected architecture: $ARCH"

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    
    # Generate secure secrets
    JWT_SECRET=$(openssl rand -hex 32)
    SESSION_SECRET=$(openssl rand -hex 32)
    
    # Update .env with generated secrets and ARM-compatible MongoDB
    cat >> .env << EOF

# Generated secrets for Raspberry Pi
JWT_SECRET=$JWT_SECRET
SESSION_SECRET=$SESSION_SECRET

# ARM-compatible MongoDB image
MONGO_IMAGE=mongo:4.4.18
EOF
    
    echo "✅ Environment configured"
fi

# Build and start everything with Docker
echo ""
echo "🐳 Building and starting application..."
echo "This may take several minutes on Raspberry Pi..."

# Build the application image for ARM
docker-compose build --no-cache

# Start all services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 15

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

# Get the IP address
PI_IP=$(hostname -I | cut -d' ' -f1)

echo ""
echo "🎉 Setup completed!"
echo ""
echo "🌐 Access your homelab tracker at:"
echo "   http://$PI_IP:5000"
echo ""
echo "🔧 Useful commands:"
echo "   docker-compose logs app    # View application logs"
echo "   docker-compose logs mongo  # View database logs"
echo "   docker-compose stop        # Stop all services"
echo "   docker-compose restart     # Restart all services"
echo ""
echo "📱 First time setup:"
echo "   1. Open the URL above in your browser"
echo "   2. Register your first user account"
echo "   3. Start tracking your homelab devices!"
echo ""