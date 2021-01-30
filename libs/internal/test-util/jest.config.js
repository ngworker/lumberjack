const baseConfig = require('../../../jest.config');

module.exports = {
  ...baseConfig,
  coverageReporters: ['text-summary', 'lcovonly'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/libs/internal/test-util/tsconfig.spec.json',
    },
  },
};
