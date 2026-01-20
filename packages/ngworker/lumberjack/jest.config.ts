module.exports = {
  displayName: 'ngworker-lumberjack',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  coverageReporters: ['lcovonly', 'text-summary'],
  coverageDirectory: '../../../coverage/packages/ngworker/lumberjack',
  transform: {
    [String.raw`^.+\.(ts|mjs|js|html)$`]: [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: String.raw`\.(html|svg)$`,
      },
    ],
  },
  transformIgnorePatterns: [String.raw`node_modules/(?!.*\.mjs$)`],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
