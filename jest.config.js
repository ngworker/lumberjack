module.exports = {
  moduleNameMapper: {
    '@internal/test-util': '<rootDir>/libs/internal/test-util/src/index.ts',
    '@internal/console-driver/test-util': '<rootDir>/libs/internal/console-driver/test-util/src/index.ts',
    '@ngworker/lumberjack/console-driver': '<rootDir>/libs/ngworker/lumberjack/console-driver/src/index.ts',
    '@ngworker/lumberjack/http-driver': '<rootDir>/libs/ngworker/lumberjack/http-driver/src/index.ts',
    '@ngworker/lumberjack': '<rootDir>/libs/ngworker/lumberjack/src/index.ts',
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};
