const baseConfig = require('../../../jest.config');

module.exports = {
  ...baseConfig,
  coverageReporters: ['text-summary', ['lcovonly', { subdir: '.', file: 'lcov-ngworker-lumberjack.info' }]],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/libs/ngworker/lumberjack/tsconfig.spec.json',
    },
  },
};
