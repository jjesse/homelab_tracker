# Raspberry Pi Deployment Guide

## Quick Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd homelab
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Generate secure credentials:**
   ```bash
   node -e "
   console.log('# Generated credentials for Raspberry Pi');
   console.log('MONGO_USERNAME=homelab_user');
   console.log('MONGO_PASSWORD=' + require('crypto').randomBytes(16).toString('hex'));
   console.log('REDIS_PASSWORD=' + require('crypto').randomBytes(16).toString('hex'));
   console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'));
   console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'));
   "
   ```

4. **Update .env file with the generated credentials**

5. **For local development (recommended):**
   ```bash
   # Set MongoDB host to localhost in .env:
   # MONGODB_URI=mongodb://homelab_user:PASSWORD@localhost:27017/homelab?authSource=admin
   # REDIS_HOST=localhost
   
   npm install
   docker-compose up mongo redis -d  # Just databases
   npm start  # Run app locally
   ```

6. **Access the application:**
   - Open browser to `http://raspberry-pi-ip:5000`

## ARM64 Compatibility Notes

- Uses `mongo:4.4.18` for ARM compatibility
- All Node.js dependencies are ARM64 compatible
- Redis 7 Alpine works on ARM64

## Resource Usage

- App: ~512MB RAM, 0.5 CPU
- MongoDB: ~1GB RAM, 1.0 CPU  
- Redis: ~256MB RAM, 0.3 CPU
- **Total: ~1.8GB RAM** (fits Raspberry Pi 4 4GB+)

## Zscaler Fields

- Will show "None" for `zscalerUserSignedIn` and `zscalerAppSegment`
- All other device tracking features work normally

## Troubleshooting

If Docker build fails on ARM64, use local development setup instead.