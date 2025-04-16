#!/bin/bash

# Enable BuildKit
export DOCKER_BUILDKIT=1

# Create and use a new builder
docker buildx create --use

# Build and push multi-platform images
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t yourdockerhubusername/homelab:latest \
  --push .
