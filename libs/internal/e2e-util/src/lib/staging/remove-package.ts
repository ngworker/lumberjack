import * as rimraf from 'rimraf';

export function removePackage(): void {
  try {
    rimraf.sync('node_modules/@ngworker/lumberjack');
  } catch {
    // it's okay if it this directory doesn't exist
  }
}
