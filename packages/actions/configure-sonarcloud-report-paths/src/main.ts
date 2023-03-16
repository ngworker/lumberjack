import * as core from '@actions/core';

import { createApp } from './app/app';
import { createConfigureSonar } from './app/configure-sonar';
import { createConfigureSonarReportPaths } from './app/configure-sonar-report-paths';
import { listFilePaths } from './app/list-file-paths';
import { Log } from './app/log';
import { replaceTextInFile } from './app/replace-text-in-file';

try {
  const lintReportKey = core.getInput('lint_report_key', {
    required: true,
  });
  const lintReportPattern = core.getInput('lint_report_pattern', {
    required: true,
  });
  const placeholder = core.getInput('placeholder', {
    required: true,
  });
  const sonarFile = core.getInput('sonar_file', {
    required: true,
  });
  const testCoverageReportKey = core.getInput('test_coverage_report_key', {
    required: true,
  });
  const testCoverageReportPattern = core.getInput('test_coverage_report_pattern', {
    required: true,
  });

  const log: Log = {
    debug: (message: string) => core.debug(message),
    error: (message: string) => core.error(message),
    info: (message: string) => core.info(message),
    notice: (message: string) => core.notice(message),
    warning: (message: string) => core.warning(message),
  };
  const configureSonar = createConfigureSonar({
    log,
    replaceTextInFile,
  });
  const configureSonarReportPaths = createConfigureSonarReportPaths({
    configureSonar,
    listFilePaths,
  });
  const app = createApp({
    configureSonarReportPaths,
  });

  (async () => {
    await app({
      lintReportKey,
      lintReportPattern,
      placeholder,
      sonarFile,
      testCoverageReportKey,
      testCoverageReportPattern,
    });
  })();
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  core.setFailed(errorMessage);
}
