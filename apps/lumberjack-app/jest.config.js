const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/apps/lumberjack-app/tsconfig.spec.json',
    },
  },
};
