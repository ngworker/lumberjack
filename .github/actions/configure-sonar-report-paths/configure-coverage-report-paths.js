import replaceInFile from 'replace-in-file';
import { listFilePaths } from './list-file-paths.js';

function listCoverageReports() {
  return listFilePaths('coverage/**/lcov.info');
}

export async function configureCoverageReportPaths(options) {
  const coverageReports = await listCoverageReports();
  const coverageReportsPattern = coverageReports.join(',');
  const to = `sonar.javascript.lcov.reportPaths=${coverageReportsPattern}`;

  await replaceInFile({
    files: options.sonarConfigurationPath,
    from: 'sonar.javascript.lcov.reportPaths=<PLACEHOLDER>',
    to,
  });
}
