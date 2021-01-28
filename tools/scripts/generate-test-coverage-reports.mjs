import { execSync } from 'child_process';
import { readFileSync, renameSync } from 'fs';
import * as path from 'path';
import readdirp from 'readdirp';

import { validateProjectName } from './util/validate-project-name.mjs';

async function flattenCoverageReports() {
  const coverageDirectory = 'coverage';

  for await (const { path: filePath } of readdirp(coverageDirectory, { fileFilter: 'lcov.info' })) {
    const flattenedFileName = flattenedCoverageReportFileName(filePath);

    renameSync(path.join(coverageDirectory, filePath), path.join(coverageDirectory, flattenedFileName));
  }
}

function flattenedCoverageReportFileName(reportPath) {
  return reportPath.replace(new RegExp('\\' + path.sep, 'g'), '-');
}

function runTestCoverageTargets() {
  const workspace = JSON.parse(readFileSync('./angular.json').toString());

  const hasTestCoverage = (project) =>
    project.architect.test &&
    project.architect.test.configurations &&
    project.architect.test.configurations.coverage != null;

  Object.entries(workspace.projects)
    .filter(([_projectName, project]) => hasTestCoverage(project))
    .map(([projectName]) => projectName)
    .forEach((projectName) => {
      validateProjectName(projectName);
      const coverageCommand = `ng test ${projectName} --configuration=coverage`;

      console.log(`> ${coverageCommand}`);
      execSync(coverageCommand, {
        stdio: 'inherit',
      });
    });
}

(async () => {
  runTestCoverageTargets();
  await flattenCoverageReports();
})();
