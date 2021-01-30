const baseConfig = require('../../../jest.config');

module.exports = {
  ...baseConfig,
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/libs/internal/test-util/tsconfig.spec.json',
    },
  },
};
