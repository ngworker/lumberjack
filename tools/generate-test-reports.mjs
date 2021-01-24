import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const workspace = JSON.parse(readFileSync('./angular.json').toString());

const hasTest = (project) =>
  project.architect.test && project.architect.test.configurations && project.architect.test.configurations.ci != null;

Object.entries(workspace.projects)
  .filter(([_projectName, project]) => hasTest(project))
  .map(([projectName]) => projectName)
  .forEach((projectName) => {
    execSync(`ng test ${projectName} --configuration=ci`, {
      stdio: 'inherit',
    });
  });
