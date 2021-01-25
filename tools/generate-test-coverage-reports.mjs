import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const workspace = JSON.parse(readFileSync('./angular.json').toString());

const hasTestCoverage = (project) =>
  project.architect.test &&
  project.architect.test.configurations &&
  project.architect.test.configurations.coverage != null;

Object.entries(workspace.projects)
  .filter(([_projectName, project]) => hasTestCoverage(project))
  .map(([projectName]) => projectName)
  .forEach((projectName) => {
    execSync(`ng test ${projectName} --configuration=coverage`, {
      stdio: 'inherit',
    });
  });
