// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { constants } = require('karma');
const path = require('path');

module.exports = () => ({
  basePath: '',
  frameworks: ['jasmine', '@angular-devkit/build-angular'],
  plugins: [
    require('karma-jasmine'),
    require('karma-chrome-launcher'),
    require('karma-jasmine-html-reporter'),
    require('karma-coverage'),
    require('karma-junit-reporter'),
    require('@angular-devkit/build-angular/plugins/karma'),
    require('karma-sonarqube-unit-reporter'),
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
    reporters: [{ type: 'text-summary' }, { type: 'lcovonly', subdir: '.', file: 'lcov.info' }],
  },
  junitReporter: {
    outputDir: path.join(__dirname, 'reports', 'test'), // results will be saved as $outputDir/$browserName.xml
    outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
    suite: '', // suite will become the package name attribute in xml testsuite element
    useBrowserName: false, // add browser name to report and classes names
    nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
    classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
    properties: {}, // key value pair of properties to add to the <properties> section of the report
    xmlVersion: 1, // use '1' if reporting to be per SonarQube 6.2 XML format
  },
  sonarQubeUnitReporter: {
    sonarQubeVersion: 'LATEST',
    outputFile: '../../../reports/test/sonar-lumberjack.xml',
    useBrowserName: false,
    // overrideTestDescription: true,
    // testPaths: ['./src/app'],
    // testFilePattern: '.spec.ts',
  },
  reporters: ['progress', 'kjhtml', 'junit', 'sonarqubeUnit'],
  port: 9876,
  colors: true,
  logLevel: constants.LOG_INFO,
  autoWatch: true,
  browsers: ['Chrome'],
  singleRun: false,
  restartOnFileChange: true,
});
