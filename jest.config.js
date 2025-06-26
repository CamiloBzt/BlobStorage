const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  moduleNameMapper: {
    'contenedor/Permissions$': '<rootDir>/__mocks__/permissions.js',
    'contenedor/validatePermissions$':
      '<rootDir>/__mocks__/validatePermissions.js',
  },
};

module.exports = createJestConfig(customJestConfig);
