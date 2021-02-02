const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  coverageReporters: ['text-summary', ['lcovonly', { subdir: '.', file: 'schematics-e2e-lcov.info' }]],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/apps/schematics-e2e/tsconfig.json',
    },
  },
};
