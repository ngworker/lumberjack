import * as core from '@actions/core';
import { configureCoverageReportPaths } from './app/configure-coverage-report-paths';
import { configureLintReportPaths } from './app/configure-lint-report-paths';

try {
  const sonarConfigurationPath = core.getInput('sonar_configuration_path');

  (async () => {
    await configureCoverageReportPaths({ sonarConfigurationPath });
    await configureLintReportPaths({ sonarConfigurationPath });
  })();
} catch (error) {
  core.setFailed(error.message);
}
