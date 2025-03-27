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

2. Build the Docker image:

   ```sh
   docker-compose build
   ```

3. Start the Docker container:

   ```sh
   docker-compose up
   ```

4. Open your browser and navigate to `http://localhost:5000`.

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

## License

This project is licensed under the MIT License.
