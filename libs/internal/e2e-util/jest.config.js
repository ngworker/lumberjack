const baseConfig = require('../../../jest.config');

module.exports = {
  ...baseConfig,
  coverageReporters: ['text-summary'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/libs/internal/e2e-util/tsconfig.spec.json',
    },
  },
};
