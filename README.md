# Home Lab Web App

This web application allows you to store details about your home lab devices. You can log in to access the app and store information about each device, such as the computer name, IP address, and operating system.

## Features

- User authentication (login and registration)
- Add and view devices

## Technologies Used

- Node.js
- Express
- MongoDB
- Passport.js
- EJS
- Docker

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

5. Open your browser and navigate to `http://localhost:5000`.

## Environment Variables

The following environment variables are required:

| Variable | Description | Default |
|----------|-------------|---------|
| JWT_SECRET | Secret key for JWT token generation | Required |
| AUTH_TOKEN_EXPIRY | JWT token expiry time (e.g., "1d" for one day) | "1d" |
| MONGODB_URI | MongoDB connection string | "mongodb://localhost:27017/homelab" |
| PORT | Application port | 5000 |

Create a `.env` file in the project root with these variables:

```sh
JWT_SECRET=your_secret_key_here
AUTH_TOKEN_EXPIRY=1d
MONGODB_URI=mongodb://localhost:27017/homelab
PORT=5000
```

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

1. Navigate to the registration page: `http://localhost:5000/users/register`
2. Fill in the registration form and submit.

### Login

1. Navigate to the login page: `http://localhost:5000/users/login`
2. Fill in the login form and submit.

### Add Device

1. After logging in, navigate to the dashboard: `http://localhost:5000/dashboard`
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

## Security Improvements

- Added `ensureGuest` middleware to prevent authenticated users from accessing login and register pages.
- Added helmet middleware to enhance security by setting various HTTP headers.
- Added input validation to the login and registration processes to prevent potential injection attacks.

## Contributing

Please read through our contributing guidelines. Included are directions for opening issues, coding standards, and notes on development.

## Changelog

All notable changes to this project are documented in the [CHANGELOG.md](CHANGELOG.md) file.

## License

This project is licensed under the MIT License.
