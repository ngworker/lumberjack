import { execSync } from 'child_process';

export function deleteAppAdditions(): void {
  execSync('git clean --force -- apps/lumberjack-schematics-app', {
    stdio: 'inherit',
  });
}
