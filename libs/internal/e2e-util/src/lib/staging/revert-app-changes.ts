import { execSync } from 'child_process';

export function revertAppChanges(): void {
  execSync('git restore apps/lumberjack-schematics-app', {
    stdio: 'inherit',
  });
}
