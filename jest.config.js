module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'models/**/*.js',
    'config/**/*.js',
    'app.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20
    }
  },
  reporters: ['default'],
  testPathIgnorePatterns: ['/node_modules/'],
  testTimeout: 5000
};
