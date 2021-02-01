const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  coverageReporters: ['text-summary', ['lcovonly', { subdir: '.', file: 'lumberjack-app-lcov.info' }]],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/apps/lumberjack-app/tsconfig.spec.json',
    },
  },
};
