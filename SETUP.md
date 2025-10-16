# 🚀 Fresh Setup Guide - Homelab Tracker

This guide walks you through setting up the Homelab Tracker application from a fresh clone.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** (check with `node --version`)
- **Docker & Docker Compose** (for databases)
- **Git** (for cloning the repository)

## ⚡ Quick Start (5 Minutes)

### 1. Clone and Setup Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/homelab-tracker.git
cd homelab-tracker

# Copy environment template
cp .env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file with your settings:

```bash
# Generate secure secrets (run these commands):
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Edit .env file with the generated secrets
```

**Required .env settings:**

```bash
# Application
PORT=5000
NODE_ENV=development

# Security (use the generated values above)
JWT_SECRET=your_generated_jwt_secret
SESSION_SECRET=your_generated_session_secret

# Database (Docker will handle these)
MONGODB_URI=mongodb://localhost:27017/homelab
REDIS_HOST=redis
REDIS_PORT=6379
```

### 3. Start Services

```bash
# Start databases with Docker
docker-compose up -d mongo redis

# Install dependencies
npm install

# Start the application
npm start
```

### 4. First Time Setup

1. **Open your browser** and navigate to `http://localhost:5000`
2. **Register your first user** - this automatically creates default categories
3. **Start adding devices** through the dashboard

## 🎯 What You Get Out of the Box

### ✅ **Automatically Created**

- **9 Default Categories** (created when you register):
  - 🟦 **Server** - Physical and virtual servers
  - 🟩 **Workstation** - Desktop and laptop computers
  - 🟨 **Network** - Network equipment and infrastructure
  - 🟦 **IoT** - Internet of Things devices
  - 🟪 **Storage** - Storage systems and NAS devices
  - 🟥 **Security** - Security appliances and firewalls
  - 🟧 **Development** - Development and testing systems
  - 🟪 **Testing** - Quality assurance environments
  - ⬜ **Other** - Miscellaneous devices

### ❌ **What You Need to Create**

- **Users** - Register through the web interface
- **Devices** - Add through the dashboard
- **Custom Categories** - Add through the category management page

## 🔧 Advanced Setup Options

### Option 1: HTTPS/SSL Setup

Generate SSL certificates for HTTPS:

```bash
# Create certificates directory
sudo mkdir -p certs

# Generate self-signed certificates
sudo openssl req -x509 -newkey rsa:2048 \
  -keyout certs/server.key \
  -out certs/server.crt \
  -days 365 -nodes \
  -subj "/C=US/ST=Test/L=Test/O=Test/CN=localhost"

# Set proper permissions
sudo chown -R $USER:$USER certs/

# Update .env
echo "SSL_KEY_PATH=./certs/server.key" >> .env
echo "SSL_CERT_PATH=./certs/server.crt" >> .env
```

Access via: `https://localhost:5000`

### Option 2: Development Mode

For development with hot reloading:

```bash
npm run dev
```

### Option 3: Full Docker Deployment

For complete containerized deployment:

```bash
# Build and start everything
docker-compose up --build

# Or in background
docker-compose up -d --build
```

## 🐳 Raspberry Pi Setup

The application is optimized for Raspberry Pi deployment with two setup options:

### Option 1: Automated Setup Script (Recommended)

```bash
# Clone the repository on your Raspberry Pi
git clone https://github.com/yourusername/homelab-tracker.git
cd homelab-tracker

# Run the automated setup script
./setup-pi.sh
```

This script will:

- Check and install prerequisites (Node.js, Docker, Docker Compose)
- Configure environment with ARM-compatible MongoDB
- Generate SSL certificates (optional)
- Install as systemd service (optional)
- Guide you through the complete setup

### Option 2: Docker Quick Start

For a complete Docker-based deployment:

```bash
# Clone and run
git clone https://github.com/yourusername/homelab-tracker.git
cd homelab-tracker
./quick-start-pi.sh
```

### Manual Raspberry Pi Setup

If you prefer manual setup:

```bash
# Use ARM-compatible MongoDB
echo "MONGO_IMAGE=mongo:4.4.18" >> .env

# Start services
docker-compose up -d mongo redis
npm install
npm start
```

## 🗄️ Database Information

### MongoDB Collections Created

- **users** - User accounts and authentication
- **devices** - Device inventory data  
- **categories** - User-specific device categories

### Redis Usage

- **Sessions** - User session storage
- **Cache** - Application caching (future use)

## 🛠️ Troubleshooting

### Common Issues

1. **Port 5000 already in use:**

   ```bash
   # Change port in .env file
   PORT=3000
   ```

2. **MongoDB connection errors:**

   ```bash
   # Ensure Docker services are running
   docker-compose ps
   docker-compose up -d mongo redis
   ```

3. **Missing dependencies:**

   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Categories not appearing:**
   - Categories are automatically created when you register
   - For existing users, run: `node scripts/seedCategories.js`

## 📊 Next Steps

After setup, you can:

1. **Add Devices** - Use the dashboard to add your homelab devices
2. **Manage Categories** - Customize device categories with colors
3. **Import/Export** - Use CSV functionality for bulk operations
4. **Explore Admin Features** - Access advanced configuration options

## 🔐 Security Notes

- Change default secrets in production
- Use HTTPS for production deployments
- Regularly update dependencies
- Consider using external MongoDB/Redis for production

## 📖 Additional Resources

- **Main README.md** - Comprehensive documentation
- **TODO.md** - Development roadmap and completed features
- **CONTRIBUTING.md** - Development guidelines
- **examples/** - Sample CSV files and configurations

---

**Need Help?** Check the main README.md or open an issue in the repository.
