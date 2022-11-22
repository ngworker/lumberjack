import replaceInFile from 'replace-in-file';
import { listFilePaths } from './list-file-paths.js';

function listLintReports() {
  return listFilePaths('reports/**/lint/report.json');
}

export async function configureLintReportPaths(options) {
  const lintReports = await listLintReports();
  const lintReportsPattern = lintReports.join(',');
  const to = `sonar.eslint.reportPaths=${lintReportsPattern}`;

  await replaceInFile({
    files: options.sonarConfigurationPath,
    from: 'sonar.eslint.reportPaths=<PLACEHOLDER>',
    to,
  });
}
