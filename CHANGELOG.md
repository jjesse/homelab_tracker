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
- Added devices array to User model to track user's devices
- Added null check for devices list in dashboard view
- Added User model population in dashboard route
- Added consistent styling for login and registration forms
- Added responsive container layouts for auth forms
- Added hover effects for auth buttons
- Added client-side form validation with HTML5 patterns
- Added password strength requirements display
- Added visual feedback for form field states
- Added improved form field styling and layout
- Added device management interface with sortable columns
- Added device search functionality
- Added action buttons for device management
- Added responsive table design for devices
- Added device statistics with Chart.js visualization
- Added device grouping functionality
- Added bulk operations for devices
- Added device status monitoring
- Added interactive charts for device distribution
- Added device grouping by various properties
- Added bulk action controls
- Added view device modal with detailed information display
- Added edit device modal with form validation
- Added responsive modal design
- Added form field validation with visual feedback
- Added GET /devices/:id endpoint for retrieving single device
- Added PUT /devices/:id endpoint for updating devices
- Added DELETE /devices/:id endpoint for removing devices
- Added user validation to device routes
- Added proper error handling for device operations
- Added delete confirmation modal
- Added dynamic UI updates after device deletion
- Added success/error notifications
- Added animation for notifications
- Added CSV export functionality for device data
- Export includes device name, IP address, operating system, system role, and network information
- Added Redis service to docker-compose.yml for session storage
- Added compression middleware for HTTP response compression
- Added missing NPM dependencies:
  - compression for HTTP compression
  - connect-redis for Redis session store
  - express-mongo-sanitize for MongoDB query sanitization
  - ioredis for Redis client
  - winston for logging
- Added new "By Hypervisor" pie chart to dashboard
  - Shows distribution of devices by hypervisor
  - Uses data from "Hypervisor Installed On" field
  - Maintains consistent styling with other charts

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
- Improved layout template implementation for consistent page structure
- Streamlined navigation bar with conditional rendering
- Enhanced form styling with flexbox layout
- Standardized alert message styling across all pages
- Enhanced form field validation with better patterns and feedback
- Improved form field layout with consistent spacing
- Updated input styling with focus and validation states
- Improved dashboard layout with better organization
- Enhanced device list view with table format
- Updated device management controls
- Enhanced dashboard with statistics panels
- Improved device table with selection capabilities
- Updated device management interface with grouping controls
- Enhanced device deletion with confirmation dialog
- Improved error handling for device operations
- Updated statistics and charts after device deletion
- Enhanced device table display to show all device fields including:
  - Hostname
  - Network
  - Hypervisor details
  - Domain user information
  - Zscaler configuration
  - Notes
- Enhanced Edit functionality with form-based editing and real-time updates
- Improved Delete functionality with proper error handling and UI feedback
- Updated device table to show only Edit and Delete actions
- Improved device edit functionality:
  - Enhanced form to handle both add and edit operations
  - Added proper form state management
  - Added cancel edit button
  - Improved form submission handling
  - Added automatic form population when editing
  - Added visual feedback for edit mode
- Reduced MongoDB logging verbosity in Docker:
  - Added --quiet flag to mongod command
  - Configured logging to /dev/null for connection logs
  - Added log filtering options

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
- Fixed devices list display in dashboard by adding null check
- Fixed user-device relationship in MongoDB schema
- Fixed dashboard route to properly populate devices
- Fixed layout template not being used in login and register pages
- Fixed inconsistent page structure across views
- Fixed duplicate HTML boilerplate in view files
- Fixed navigation links visibility issues
- Fixed template engine error with login.ejs by removing incorrect layout include
- Fixed layout inheritance for login and register pages
- Fixed "device is not defined" error in dashboard.ejs by adding proper null checks
- Added fallback for cases where user.devices is undefined
- Improved error handling for empty device lists
- Fixed Select All functionality not working properly with dynamic table updates
- Fixed CSV export to properly handle special characters and include all device fields
- Fixed Select All functionality by properly handling checkbox state changes
- Fixed CSV export by correctly accessing data attributes and handling empty values
- Added error message when trying to export without selected devices
- Improved checkbox state synchronization between Select All and individual checkboxes
- Added Redis service configuration and health check
- Updated docker-compose.yml with Redis service and volume
- Fixed CSRF configuration by adding cookie-parser and proper cookie settings
- Updated CSRF middleware placement to work correctly with session
- Fixed pie charts data aggregation:
  - Corrected "By Network" chart to use Network field
  - Corrected "By Role" chart to use System Role field
  - Updated data source column indices to match table structure
- Fixed Edit Device functionality by adding missing form fields to edit modal
- Ensured Edit Device form properly populates with current device data
- Fixed edit functionality not properly updating device information
- Fixed form not clearing after canceling edit
- Fixed form submission method not changing between add/edit modes
- Improved edit UI feedback and usability
- Fixed delete confirmation showing both browser confirm and modal
- Fixed delete success message showing error incorrectly
- Fixed edit functionality by removing duplicate event listeners
- Improved edit form handling and state management
- Fixed device form submission:
  - Fixed add device functionality by using regular form submission
  - Fixed edit device functionality by using fetch with proper JSON data
  - Added proper handling of POST vs PUT methods
  - Fixed form data validation issues

### Security

- Implemented HTTPS for secure connections
- Implemented CSRF protection.
- Implemented rate limiting to protect against brute-force attacks.
- Improved password hashing.
- Enhanced session security.
- Added user ownership validation for device operations.

### Verified

- Confirmed docker-compose.yml `depends_on` configuration is correctly set up for app service dependency on MongoDB with health check condition

## [Upcoming]

### Security Changes

- Add input sanitization middleware
- Implement API rate limiting per endpoint
- Add password complexity validation
- Add account lockout mechanism
- Configure secure headers

### Testing

- Add Jest unit test suite
- Add API integration tests
- Add test coverage reporting
- Add CI pipeline configuration

### Performance

- Implement Redis caching
- Optimize MongoDB queries
- Add compression middleware
- Add static asset optimization

### Error Handling

- Add global error handler
- Standardize error responses
- Implement error logging service
- Add validation middleware

### Removed

- Removed View device functionality and associated modal as it was redundant
