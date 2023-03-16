import { replaceInFile } from 'replace-in-file';
import { listFilePaths } from './list-file-paths';

function listLintReports() {
  return listFilePaths('reports/**/lint/report.json');
}

export async function configureLintReportPaths(options) {
  const lintReports = await listLintReports();
  const lintReportsPattern = lintReports.join(',');
  const sonarConfigurationKey = 'sonar.eslint.reportPaths';

  await replaceInFile({
    files: options.sonarConfigurationPath,
    from: `${sonarConfigurationKey}=<PLACEHOLDER>`,
    to: `${sonarConfigurationKey}=${lintReportsPattern}`,
  });
}
