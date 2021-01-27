import { execSync } from 'child_process';
import { mkdirSync, readFileSync } from 'fs';

function generateLintReports() {
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

function sanitizeLintReportItems() {
  // EXAMPLES:
  // Local
  // [{"endPosition":{"character":24,"line":12,"position":444},"failure":"Identifier 'thrownErrorMessage' is never reassigned; use 'const' instead of 'let'.","fix":{"innerStart":422,"innerLength":3,"innerText":"const"},"name":"C:/projects/github/ngworker/lumberjack/libs/ngworker/lumberjack/src/lib/formatting/format-log-driver-error.ts","ruleName":"prefer-const","ruleSeverity":"error","startPosition":{"character":6,"line":12,"position":426}},{"endPosition":{"character":20,"line":13,"position":510},"failure":"Identifier 'payloadMessage' is never reassigned; use 'const' instead of 'let'.","fix":{"innerStart":492,"innerLength":3,"innerText":"const"},"name":"C:/projects/github/ngworker/lumberjack/libs/ngworker/lumberjack/src/lib/formatting/format-log-driver-error.ts","ruleName":"prefer-const","ruleSeverity":"error","startPosition":{"character":6,"line":13,"position":496}}]
  // CI
  // [{"endPosition":{"character":24,"line":12,"position":444},"failure":"Identifier 'thrownErrorMessage' is never reassigned; use 'const' instead of 'let'.","fix":{"innerStart":422,"innerLength":3,"innerText":"const"},"name":"/home/runner/work/lumberjack/lumberjack/libs/ngworker/lumberjack/src/lib/formatting/format-log-driver-error.ts","ruleName":"prefer-const","ruleSeverity":"error","startPosition":{"character":6,"line":12,"position":426}},{"endPosition":{"character":20,"line":13,"position":510},"failure":"Identifier 'payloadMessage' is never reassigned; use 'const' instead of 'let'.","fix":{"innerStart":492,"innerLength":3,"innerText":"const"},"name":"/home/runner/work/lumberjack/lumberjack/libs/ngworker/lumberjack/src/lib/formatting/format-log-driver-error.ts","ruleName":"prefer-const","ruleSeverity":"error","startPosition":{"character":6,"line":13,"position":496}}]
  // Remove workspace path from `name` property of lint report items
}

generateLintReports();
sanitizeLintReportItems();
