// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { constants } = require('karma');
const path = require('path');

const minimumTestCoveragePercentage = 85;
const yellowTestCoveragePercentage = 90;
const greenTestCoveragePercentage = 95;
const testCoverageWatermarks = [yellowTestCoveragePercentage, greenTestCoveragePercentage];

module.exports = () => ({
  basePath: '',
  frameworks: ['jasmine', '@angular-devkit/build-angular'],
  plugins: [
    require('karma-jasmine'),
    require('karma-chrome-launcher'),
    require('karma-jasmine-html-reporter'),
    require('karma-coverage'),
    require('@angular-devkit/build-angular/plugins/karma'),
  ],
  client: {
    clearContext: false, // leave Jasmine Spec Runner output visible in browser
  },
  jasmineHtmlReporter: {
    suppressAll: true, // removes the duplicated traces
  },
  coverageReporter: {
    dir: path.join(__dirname, 'coverage'),
    subdir: '.',
    reporters: [{ type: 'html' }, { type: 'text-summary' }, { type: 'lcovonly', subdir: '.', file: 'lcov.info' }],
    // see https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md
    check: {
      // minimum overall test coverage
      global: {
        statements: minimumTestCoveragePercentage,
        branches: minimumTestCoveragePercentage,
        functions: minimumTestCoveragePercentage,
        lines: minimumTestCoveragePercentage,
      },
      // minimum test coverage on a per file basis
      each: {
        statements: minimumTestCoveragePercentage,
        branches: minimumTestCoveragePercentage,
        functions: minimumTestCoveragePercentage,
        lines: minimumTestCoveragePercentage,
      },
    },
    // coverage threshold colors
    watermarks: {
      statements: testCoverageWatermarks,
      functions: testCoverageWatermarks,
      branches: testCoverageWatermarks,
      lines: testCoverageWatermarks,
    },
  },
  reporters: ['progress', 'kjhtml'],
  port: 9876,
  colors: true,
  logLevel: constants.LOG_INFO,
  autoWatch: true,
  browsers: ['Chrome'],
  singleRun: false,
  restartOnFileChange: true,
});
