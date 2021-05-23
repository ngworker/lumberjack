import * as copy from 'copy';
import { mkdirSync } from 'fs';

function createPackageParentDirectory(): void {
  try {
    mkdirSync('node_modules/@ngworker');
  } catch {
    // it's okay if this directory already exists
  }
}

export async function addPackage(): Promise<void> {
  createPackageParentDirectory();
  await new Promise((resolve, reject) => {
    copy('dist/ngworker/lumberjack/**', 'node_modules/@ngworker/lumberjack', { cwd: process.cwd() }, (error, files) => {
      if (error) {
        reject(error);

        return;
      }

      resolve(files);
    });
  });
}
