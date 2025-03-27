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

### Changed

- Documented setup and usage in README.md.
- Improved security by moving sensitive environment variables to .env file

### Fixed
- Docker build issues related to missing environment variables
- Improved documentation for Docker deployment
