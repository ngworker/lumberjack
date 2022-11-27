import * as core from '@actions/core';

import { app } from './app/app';

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
