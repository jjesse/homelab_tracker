// Simple smoke tests for the homelab application

describe('Homelab App Basic Tests', () => {
  test('Package.json has correct name and version', () => {
    const pkg = require('../package.json');
    expect(pkg.name).toBe('homelab');
    expect(pkg.version).toBe('1.3.0');
    expect(pkg.description).toContain('Raspberry Pi Ready');
  });

  test('Environment example file exists', () => {
    const fs = require('fs');
    expect(fs.existsSync('.env.example')).toBe(true);
  });

  test('SSL generation script exists and is executable', () => {
    const fs = require('fs');
    expect(fs.existsSync('generate-ssl.sh')).toBe(true);
    const stats = fs.statSync('generate-ssl.sh');
    expect(stats.mode & parseInt('111', 8)).toBeTruthy(); // Check if executable
  });

  test('Docker compose file exists', () => {
    const fs = require('fs');
    expect(fs.existsSync('docker-compose.yml')).toBe(true);
  });

  test('Main routes files exist', () => {
    const fs = require('fs');
    expect(fs.existsSync('routes/index.js')).toBe(true);
    expect(fs.existsSync('routes/users.js')).toBe(true);
    expect(fs.existsSync('routes/devices.js')).toBe(true);
  });

  test('Models exist', () => {
    const fs = require('fs');
    expect(fs.existsSync('models/User.js')).toBe(true);
    expect(fs.existsSync('models/Device.js')).toBe(true);
  });

  test('Views exist', () => {
    const fs = require('fs');
    expect(fs.existsSync('views/layout.ejs')).toBe(true);
    expect(fs.existsSync('views/dashboard.ejs')).toBe(true);
    expect(fs.existsSync('views/login.ejs')).toBe(true);
  });
});