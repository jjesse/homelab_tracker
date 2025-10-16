#!/bin/bash

# Homelab Tracker - Raspberry Pi Setup Script
# This script sets up the homelab tracker application on a Raspberry Pi

set -e

echo "🍓 Homelab Tracker - Raspberry Pi Setup"
echo "======================================="

# Check if we're on ARM architecture
ARCH=$(uname -m)
echo "Detected architecture: $ARCH"

if [[ "$ARCH" != "aarch64" && "$ARCH" != "armv7l" ]]; then
    echo "⚠️  Warning: This script is designed for Raspberry Pi (ARM architecture)"
    echo "   Detected: $ARCH"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js first."
    exit 1
else
    NPM_VERSION=$(npm --version)
    echo "✅ npm found: $NPM_VERSION"
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "🔄 Please log out and log back in for Docker permissions to take effect"
else
    DOCKER_VERSION=$(docker --version)
    echo "✅ Docker found: $DOCKER_VERSION"
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Installing..."
    sudo apt-get update
    sudo apt-get install -y docker-compose
else
    COMPOSE_VERSION=$(docker-compose --version)
    echo "✅ Docker Compose found: $COMPOSE_VERSION"
fi

# Setup environment
echo ""
echo "🔧 Setting up environment..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    
    # Generate secure secrets
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    # Update .env with generated secrets
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    sed -i "s/SESSION_SECRET=.*/SESSION_SECRET=$SESSION_SECRET/" .env
    
    # Set ARM-compatible MongoDB image
    echo "MONGO_IMAGE=mongo:4.4.18" >> .env
    
    echo "✅ Environment configured with secure secrets"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Start databases
echo ""
echo "🗄️  Starting databases..."
docker-compose up -d mongo redis

# Wait for databases to be ready
echo "⏳ Waiting for databases to start..."
sleep 10

# Check if databases are running
if docker-compose ps | grep -q "mongo.*Up"; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB failed to start"
    docker-compose logs mongo
    exit 1
fi

if docker-compose ps | grep -q "redis.*Up"; then
    echo "✅ Redis is running"
else
    echo "❌ Redis failed to start"
    docker-compose logs redis
    exit 1
fi

# Generate SSL certificates for HTTPS (optional)
echo ""
read -p "🔐 Generate SSL certificates for HTTPS? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    if [ ! -f certs/server.crt ]; then
        echo "🔐 Generating SSL certificates..."
        mkdir -p certs
        openssl req -x509 -newkey rsa:2048 \
            -keyout certs/server.key \
            -out certs/server.crt \
            -days 365 -nodes \
            -subj "/C=US/ST=Homelab/L=RaspberryPi/O=Homelab/CN=$(hostname)"
        
        # Update .env for SSL
        echo "SSL_KEY_PATH=./certs/server.key" >> .env
        echo "SSL_CERT_PATH=./certs/server.crt" >> .env
        
        echo "✅ SSL certificates generated"
    else
        echo "✅ SSL certificates already exist"
    fi
fi

# Setup systemd service (optional)
echo ""
read -p "🚀 Install as system service? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo "🚀 Installing systemd service..."
    
    # Update the service file with correct path
    SERVICE_FILE="homelab.service"
    sudo cp $SERVICE_FILE /etc/systemd/system/
    
    # Update the service file to use current directory
    sudo sed -i "s|WorkingDirectory=.*|WorkingDirectory=$(pwd)|" /etc/systemd/system/homelab.service
    sudo sed -i "s|ExecStart=.*|ExecStart=/usr/bin/node $(pwd)/app.js|" /etc/systemd/system/homelab.service
    
    sudo systemctl daemon-reload
    sudo systemctl enable homelab
    
    echo "✅ Service installed. Use 'sudo systemctl start homelab' to start"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "🔧 Next steps:"
echo "   1. Start the application: npm start"
echo "   2. Open browser to: http://$(hostname -I | cut -d' ' -f1):5000"
if [ -f certs/server.crt ]; then
    echo "      Or HTTPS: https://$(hostname -I | cut -d' ' -f1):5000"
fi
echo "   3. Register your first user account"
echo "   4. Start adding your devices!"
echo ""

if [[ -f /etc/systemd/system/homelab.service ]]; then
    echo "🚀 To run as service:"
    echo "   sudo systemctl start homelab    # Start the service"
    echo "   sudo systemctl stop homelab     # Stop the service"
    echo "   sudo systemctl status homelab   # Check status"
    echo ""
fi

echo "📚 For more help, see:"
echo "   - SETUP.md for detailed setup instructions"
echo "   - README.md for complete documentation"
echo ""
echo "Happy homelabbing! 🏠🔬"