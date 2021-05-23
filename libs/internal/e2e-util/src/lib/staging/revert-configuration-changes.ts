import { execSync } from 'child_process';

function revertTypeScriptConfigurationChanges(): void {
  execSync('git restore tsconfig.json', {
    stdio: 'inherit',
  });
}

export function revertConfigurationChanges(): void {
  revertTypeScriptConfigurationChanges();
}
