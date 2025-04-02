# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial setup of the Home Lab web app.
- User authentication (login and registration) using Passport.js.
- MongoDB models for User and Device.
- Routes for home, login, register, and dashboard.
- Views for home, login, register, and dashboard.
- Form to add devices on the dashboard.
- Display list of devices on the dashboard.
- Dockerfile and docker-compose.yml for Docker setup.
- Added new attributes to Device model: Hostname, Network, System Role, Hypervisor Installed On, Domain User Signed In, Zscaler User Signed In, Zscaler App Segment, Notes.
- Added `ensureGuest` middleware to prevent authenticated users from accessing login and register pages.
- Added helmet middleware to enhance security by setting various HTTP headers.
- User-specific dashboards - each user now sees only their own devices and labs
- Environment variable support with .env file
- Documentation for required environment variables in README.md
- .env.example template file for environment configuration
- Better Docker setup instructions including environment configuration steps
- Added HTTPS support with SSL certificate configuration
- Added SSL certificate generation instructions
- Added SSL environment variables
- Input validation using `express-validator`.
- CSRF protection to forms.
- Rate limiting middleware.
- Logging middleware using `morgan`.
- Defined network in `docker-compose.yml` for service communication.
- Added health check for MongoDB service in `docker-compose.yml`.
- Docker Compose configuration with:
  - Node.js application container with resource limits (512MB RAM, 0.5 CPU)
  - MongoDB container with resource limits (1GB RAM, 1.0 CPU)
  - Health checks for both services
  - Container logging configuration with rotation (10MB max size, 3 files)
  - Volume mounting for persistent MongoDB data
  - Bridge network configuration
  - Wait-for-it script implementation for proper service startup order
- Device routes implementation
  - GET / endpoint to retrieve user devices
  - POST /add endpoint to create new devices
- Jest testing framework for unit tests
- Debug configuration for development

### Changed

- Documented setup and usage in README.md.
- Improved security by moving sensitive environment variables to .env file
- Improved password hashing using `bcryptjs`.
- Enhanced session management with secure options.
- Refactored user registration logic.
- Improved Docker setup with network and health check configurations.
- Updated MongoDB configuration:
  - Updated MongoDB version to 7.0 for latest features and security
  - Removed complex volume mount configuration
  - Added MongoDB authentication
  - Improved MongoDB healthcheck using mongosh
  - Added explicit memory and CPU limits
  - Added logging configuration with rotation
- Implemented full HTTPS support with automatic HTTP to HTTPS redirection
- Updated Docker configuration to handle HTTPS traffic

### Fixed

- Docker build issues related to missing environment variables
- Improved documentation for Docker deployment
- Fixed Docker build issues by correctly ordering Dockerfile operations
- Fixed missing package.json causing Docker build failures
- Fixed Docker container port configuration to use port 5000
- Fixed Docker volume configuration issues
- Added proper volume mapping for SSL certificates
- Fixed MongoDB data persistence in Docker setup
- Fixed Docker volume configuration by using named volumes
- Improved container security by running as non-root user
- Fixed MongoDB container restart policy
- Fixed user registration by properly handling async/await in passport.js
- Fixed missing session secret environment variable
- Fixed missing dependencies in package.json
- Enhanced container health checks with better timeout and retry settings
- Improved wait-for-it.sh script with maximum attempts and better error handling
- Added more comprehensive health check endpoint with MongoDB connection status
- Fixed MongoDB container restart issues by:
  - Added proper authentication to MongoDB healthcheck
  - Adjusted MongoDB cache size for container environment
  - Added file descriptor limits for MongoDB stability
  - Modified healthcheck timing for better reliability
- Improved MongoDB container stability:
  - Updated MongoDB version to 7.0
  - Implemented proper authentication
  - Added resource limits for better stability
  - Added logging rotation configuration
- Fixed express-session deprecation warning by properly configuring session secret
- Added missing devices route handler
- Fixed Module not found error for devices routes
- Added missing layout.ejs file for express-ejs-layouts

### Security

- Implemented HTTPS for secure connections
- Implemented CSRF protection.
- Implemented rate limiting to protect against brute-force attacks.
- Improved password hashing.
- Enhanced session security.

### Verified

- Confirmed docker-compose.yml `depends_on` configuration is correctly set up for app service dependency on MongoDB with health check condition
