const baseConfig = require('../../../jest.config');

module.exports = {
  ...baseConfig,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/libs/internal/test-util/tsconfig.spec.json',
    },
  },
};
