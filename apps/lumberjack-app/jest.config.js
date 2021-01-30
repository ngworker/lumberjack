const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/apps/lumberjack-app/tsconfig.spec.json',
    },
  },
};
