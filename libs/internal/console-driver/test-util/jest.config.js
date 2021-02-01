const baseConfig = require('../../../../jest.config');

module.exports = {
  ...baseConfig,
  coverageReporters: ['text-summary'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/libs/internal/console-driver/test-util/tsconfig.spec.json',
    },
  },
};
