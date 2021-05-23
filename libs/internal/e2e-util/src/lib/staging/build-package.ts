import { execSync } from 'child_process';

export function buildPackage(): void {
  execSync('yarn run build:lib', {
    stdio: 'inherit',
  });
}
