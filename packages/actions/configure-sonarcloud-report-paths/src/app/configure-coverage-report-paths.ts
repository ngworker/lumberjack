import { replaceInFile } from 'replace-in-file';

import { listFilePaths } from './list-file-paths';

function listCoverageReports() {
  return listFilePaths('coverage/**/lcov.info');
}

export async function configureCoverageReportPaths(options) {
  const coverageReports = await listCoverageReports();
  const coverageReportsPattern = coverageReports.join(',');
  const sonarConfigurationKey = 'sonar.javascript.lcov.reportPaths';

  await replaceInFile({
    files: options.sonarConfigurationPath,
    from: `${sonarConfigurationKey}=<PLACEHOLDER>`,
    to: `${sonarConfigurationKey}=${coverageReportsPattern}`,
  });
}
