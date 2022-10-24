import glob from 'glob';
import replaceInFile from 'replace-in-file';

const sonarConfigurationPath = 'sonar-project.properties';

async function configureCoverageReportPaths() {
  const coverageReports = await listCoverageReports();
  const coverageReportsPattern = coverageReports.join(',');
  const to = `sonar.javascript.lcov.reportPaths=${coverageReportsPattern}`;

  await replaceInFile({
    files: sonarConfigurationPath,
    from: 'sonar.javascript.lcov.reportPaths=<PLACEHOLDER>',
    to,
  });
}

async function configureLintReportPaths() {
  const lintReports = await listLintReports();
  const lintReportsPattern = lintReports.join(',');
  const to = `sonar.eslint.reportPaths=${lintReportsPattern}`;

  await replaceInFile({
    files: sonarConfigurationPath,
    from: 'sonar.eslint.reportPaths=<PLACEHOLDER>',
    to,
  });
}

function listCoverageReports() {
  return listFilePaths('coverage/**/lcov.info');
}

function listFilePaths(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (error, filePaths) => {
      if (error) {
        reject(error);

        return;
      }

      resolve(filePaths);
    });
  });
}

function listLintReports() {
  return listFilePaths('reports/**/lint/report.json');
}

(async () => {
  await configureCoverageReportPaths();
  await configureLintReportPaths();
})();
