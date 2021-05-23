import { execSync } from 'child_process';

export function deletePathAliases(): void {
  execSync('yarn run delete-path-alias @ngworker/lumberjack', {
    stdio: 'inherit',
  });
  execSync('yarn run delete-path-alias @ngworker/lumberjack/console-driver', {
    stdio: 'inherit',
  });
  execSync('yarn run delete-path-alias @ngworker/lumberjack/http-driver', {
    stdio: 'inherit',
  });
}
