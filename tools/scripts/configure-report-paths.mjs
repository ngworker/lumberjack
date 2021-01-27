import glob from 'glob';
import replaceInFile from 'replace-in-file';

const sonarConfigurationPath = 'sonar-project.properties';

async function configureCoverageReportPaths() {
  const coverageReports = await listCoverageReports();
  const coverageReportsPattern = coverageReports.join(',');

  await replaceInFile({
    files: sonarConfigurationPath,
    from: 'sonar.javascript.lcov.reportPaths=<PLACEHOLDER>',
    to: `sonar.javascript.lcov.reportPaths=${coverageReportsPattern}`,
  });
}

async function configureLintReportPaths() {
  const lintReports = await listLintReports();
  const lintReportsPattern = lintReports.join(',');

  await replaceInFile({
    files: sonarConfigurationPath,
    from: 'sonar.typescript.tslint.reportPaths=<PLACEHOLDER>',
    to: `sonar.typescript.tslint.reportPaths=${lintReportsPattern}`,
  });
}

function listCoverageReports() {
  return listFilePaths('coverage/*-lcov.info');
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
  return listFilePaths('reports/lint/*.json');
}

(async () => {
  await configureCoverageReportPaths();
  await configureLintReportPaths();
})();
