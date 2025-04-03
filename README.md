# Home Lab Web App

This web application allows you to store details about your home lab devices. You can log in to access the app and store information about each device, such as the computer name, IP address, and operating system.

## Features

- User authentication (login and registration)
- Device Management:
  - Sortable device table
  - Real-time device search
  - View device details
  - Edit device information
  - Delete devices
  - Responsive table design
- HTTPS support
- Docker containerization
- MongoDB integration

## Technologies Used

- Node.js
- Express
- MongoDB
- Passport.js
- EJS
- Docker
- express-validator
- helmet
- express-rate-limit
- csurf
- morgan

## Installation

### Local Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/homelab.git
   cd homelab
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up MongoDB:
   Make sure you have MongoDB installed and running. The app uses a local MongoDB instance by default.

4. Start the application:

   ```sh
   npm start
   ```

5. Open your browser and navigate to `http://localhost:5000`.

### Docker Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/homelab.git
   cd homelab
   ```

2. Create a .env file:

   ```sh
   cp .env.example .env
   ```

   Then edit the .env file with your settings.

3. Build the Docker image:

   ```sh
   docker-compose build
   ```

4. Start the Docker container:

   ```sh
   docker-compose up
   ```

5. Open your browser and navigate to `https://localhost:8443` or `http://localhost:8080`.

   **Note:** The Docker setup now includes a defined network for service communication and a health check for the MongoDB service.

## Docker Configuration

The application is containerized using Docker with the following features:

### Services

- **Application**: Node.js application running on port 5000
  - Memory: 512MB (256MB reserved)
  - CPU: 0.5 cores
  - Auto-restart enabled
  - Health check endpoint: `/health`
  - JSON file logging with rotation (10MB max size, 3 files)

- **MongoDB**: Version 7.0 running on port 27017
  - Memory: 1GB
  - CPU: 1.0 cores
  - Authentication enabled
  - Health check using mongosh
  - JSON file logging with rotation (10MB max size, 3 files)
  - Persistent data storage with named volume

### Environment Setup

1. Create a `.env` file with the following variables:

   ```
   MONGO_USERNAME=your_username
   MONGO_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_here
   AUTH_TOKEN_EXPIRY=24h
   SESSION_SECRET=your_session_secret_here
   ```

2. Start the services:

   ```bash
   docker-compose up -d
   ```

### Logging

Both services use JSON file logging with automatic rotation:

- Maximum file size: 10MB
- Maximum number of files: 3

## Environment Variables

The following environment variables are required:

| Variable | Description | Default |
|----------|-------------|---------|
| JWT_SECRET | Secret key for JWT token generation | Required |
| AUTH_TOKEN_EXPIRY | JWT token expiry time (e.g., "1d" for one day) | "1d" |
| MONGODB_URI | MongoDB connection string | "mongodb://localhost:27017/homelab" |
| PORT | Application port | 5000 |
| SESSION_SECRET | Secret for express-session | Required |
| SSL_KEY_PATH | Path to SSL private key file | "./certs/server.key" |
| SSL_CERT_PATH | Path to SSL certificate file | "./certs/server.crt" |

Create a `.env` file in the project root with these variables:

```sh
JWT_SECRET=your_secret_key_here
AUTH_TOKEN_EXPIRY=1d
MONGODB_URI=mongodb://localhost:27017/homelab
PORT=5000
SESSION_SECRET=your_session_secret_here
SSL_KEY_PATH=./certs/server.key
SSL_CERT_PATH=./certs/server.crt
```

### Setting JWT_SECRET and SESSION_SECRET

Both secrets should be:

- At least 32 characters long
- Random and unpredictable
- Unique for each environment
- Never committed to version control

You can generate secure secrets using Node.js:

```sh
# Generate JWT_SECRET
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Generate SESSION_SECRET
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated strings to your .env file:

```sh
JWT_SECRET=generated_jwt_secret_from_above_command
SESSION_SECRET=generated_session_secret_from_above_command
```

### SSL Configuration

1. Generate self-signed certificates (for development):

   ```sh
   mkdir certs
   cd certs
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt
   ```

   When prompted, fill in the certificate details. For local development, you can use:
   - Common Name (CN): localhost
   - Organization Name (O): HomeLabDev
   - The rest can be left as default

2. Set proper permissions (Unix systems):

   ```sh
   chmod 600 server.key
   chmod 644 server.crt
   ```

3. Add certificate paths to .env:

   ```sh
   SSL_KEY_PATH=./certs/server.key
   SSL_CERT_PATH=./certs/server.crt
   ```

4. For production:
   - Replace with valid SSL certificates from a trusted provider
   - Never use self-signed certificates in production
   - Consider using Let's Encrypt for free SSL certificates

#### Troubleshooting SSL

- **Certificate Not Trusted**: When using self-signed certificates, your browser will show a warning. This is normal in development. Click "Advanced" and "Proceed" to continue.
- **Certificate Not Found**: Make sure the certificates are properly mounted in Docker by checking the volume mapping in docker-compose.yml
- **Permission Issues**: Ensure the certificates are readable by the node process in the container

## File Structure

```
/home/jjesse/git/homelab
├── models
│   ├── User.js
│   └── Device.js
├── routes
│   ├── index.js
│   └── users.js
├── views
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── dashboard.ejs
├── app.js
├── config
│   ├── passport.js
│   └── auth.js
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Usage

### Register

1. Navigate to the registration page: `https://localhost:8443/users/register`

### Login

1. Navigate to the login page: `https://localhost:8443/users/login`

### Add Device

1. After logging in, navigate to the dashboard: `https://localhost:8443/dashboard`
2. Fill in the device form and submit to add a new device. The form includes the following fields:
   - Device Name
   - IP Address
   - Operating System
   - Hostname
   - Network
   - System Role
   - Hypervisor Installed On
   - Domain User Signed In
   - Zscaler User Signed In
   - Zscaler App Segment
   - Notes

### View Devices

1. After logging in, navigate to the dashboard: `http://localhost:5000/dashboard`
2. Your devices will be listed under "Your Devices".

## Device Management

The dashboard provides a comprehensive device management interface with the following features:

### Device Table

- Sortable columns (click column headers to sort)
- Real-time search filtering
- Responsive design for all screen sizes

### Device Actions

- View: See detailed device information
- Edit: Modify device properties
- Delete: Remove devices from your inventory

### Adding Devices

1. Click "Add New Device" button
2. Fill in the required fields:
   - Device Name
   - IP Address
   - Operating System
   - Hostname
   - Network
   - System Role
   - Hypervisor Information
   - Domain User
   - Zscaler Configuration
3. Add optional notes
4. Submit the form

### Search and Filter

Use the search box above the device table to filter devices by any field:

- Device name
- IP address
- Operating system
- System role

## API Routes

### Devices

- GET `/devices` - Get all devices for authenticated user
- POST `/devices/add` - Add a new device
  - Required fields: name, ipAddress, operatingSystem, hostname, network, systemRole, hypervisorInstalledOn, domainUserSignedIn, zscalerUserSignedIn, zscalerAppSegment
  - Optional fields: notes

## Security Improvements

- Added `ensureGuest` middleware to prevent authenticated users from accessing login and register pages.
- Added helmet middleware to enhance security by setting various HTTP headers.
- Implemented input validation using `express-validator` to prevent injection attacks.
- Implemented CSRF protection to prevent cross-site request forgery attacks.
- Implemented rate limiting to protect against brute-force attacks.
- Improved password hashing using `bcryptjs`.
- Enhanced session security with `httpOnly`, `secure`, and `sameSite` options.
- Utilized `morgan` for logging.

## Development

To run the application in debug mode:

```sh
npm run dev:debug
```

To run tests:

```sh
npm test
```

## Contributing

Please read through our contributing guidelines. Included are directions for opening issues, coding standards, and notes on development.

## Changelog

All notable changes to this project are documented in the [CHANGELOG.md](CHANGELOG.md) file.

## License

This project is licensed under the MIT License.
