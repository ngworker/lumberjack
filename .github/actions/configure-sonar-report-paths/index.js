import * as core from '@actions/core';
import { configureCoverageReportPaths } from './configure-coverage-report-paths.js';
import { configureLintReportPaths } from './configure-lint-report-paths.js';

try {
  const sonarConfigurationPath = core.getInput('sonar_configuration_path');

  await configureCoverageReportPaths({ sonarConfigurationPath });
  await configureLintReportPaths({ sonarConfigurationPath });
} catch (error) {
  core.setFailed(error.message);
}
