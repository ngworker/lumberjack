const baseConfig = require('../../../jest.config');

module.exports = {
  ...baseConfig,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/libs/ngworker/lumberjack/tsconfig.spec.json',
    },
  },
};
