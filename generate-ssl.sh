#!/bin/bash

# SSL Certificate Generation Script for Raspberry Pi
# This creates self-signed certificates for local homelab use

echo "🔐 Generating SSL certificates for homelab application..."

# Create certs directory if it doesn't exist
mkdir -p certs

# Generate private key and certificate
openssl req -x509 -newkey rsa:4096 -keyout certs/server.key -out certs/server.crt -days 365 -nodes \
  -subj "/C=US/ST=Homelab/L=Local/O=Homelab/OU=Development/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:*.local,IP:127.0.0.1,IP:192.168.1.100"

# Set proper permissions
chmod 600 certs/server.key
chmod 644 certs/server.crt

echo "✅ SSL certificates generated successfully!"
echo ""
echo "Certificate details:"
openssl x509 -in certs/server.crt -text -noout | grep -A2 "Subject:"
echo ""
echo "Files created:"
echo "  - certs/server.key (private key)"
echo "  - certs/server.crt (certificate)"
echo ""
echo "📝 Add these lines to your .env file:"
echo "SSL_KEY_PATH=./certs/server.key"
echo "SSL_CERT_PATH=./certs/server.crt"
echo "NODE_ENV=production"
echo ""
echo "🚀 Restart your app and access via https://localhost:5000"
echo ""
echo "⚠️  Note: You'll need to accept the self-signed certificate warning in your browser."