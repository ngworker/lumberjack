import { execSync } from 'child_process';
import { mkdirSync, readFileSync } from 'fs';

function runTestCoverageTargets() {
  const workspace = JSON.parse(readFileSync('./angular.json').toString());

  const hasLint = (project) => project.architect.lint;

  mkdirSync('reports/lint', {
    recursive: true,
  });

  Object.entries(workspace.projects)
    .filter(([_projectName, project]) => hasLint(project))
    .map(([projectName]) => projectName)
    .forEach((projectName) => {
      const lintCommand = `ng lint ${projectName} --format=json --force > reports/lint/${projectName}.json`;

      console.log(`> ${lintCommand}`);
      execSync(lintCommand, {
        stdio: 'inherit',
      });
    });
}

runTestCoverageTargets();
