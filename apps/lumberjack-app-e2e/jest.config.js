const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/apps/lumberjack-app-e2e/tsconfig.spec.json',
    },
  },
};
