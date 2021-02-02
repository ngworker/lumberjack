import { execSync } from 'child_process';
import * as copy from 'copy';
import { mkdirSync, readFileSync } from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';

function isCiWorkflow(): boolean {
  return process.env.CI === 'TRUE';
}

describe('@ngworker/lumberjack:ng-add e2e', () => {
  beforeAll(async () => {
    execSync('yarn run delete-path-alias @ngworker/lumberjack', {
      stdio: 'inherit',
    });
    execSync('yarn run delete-path-alias @ngworker/lumberjack/console-driver', {
      stdio: 'inherit',
    });
    execSync('yarn run delete-path-alias @ngworker/lumberjack/http-driver', {
      stdio: 'inherit',
    });

    if (isCiWorkflow()) {
      return;
    }

    try {
      rimraf.sync('node_modules/@ngworker/lumberjack');
    } catch {
      // it's okay if it this directory doesn't exist
    }

    execSync('yarn run build:lib', {
      stdio: 'inherit',
    });

    try {
      mkdirSync('node_modules/@ngworker');
    } catch {
      // it's okay if this directory already exists
    }

    // const from = path.resolve(process.cwd(), './dist/ngworker/lumberjack');
    const from = 'dist/ngworker/lumberjack';
    // const to = path.resolve(process.cwd(), './node_modules/@ngworker/lumberjack');
    const to = 'node_modules/@ngworker/lumberjack';
    // renameSync(from, to);
    await new Promise((resolve, reject) => {
      copy(`${from}/**`, to, { cwd: process.cwd() }, (error, files) => {
        if (error) {
          reject(error);

          return;
        }

        resolve(files);
      });
    });
  });

  afterEach(() => {
    execSync('git restore tsconfig.json', {
      stdio: 'inherit',
    });
    execSync('git restore apps/lumberjack-schematics-app', {
      stdio: 'inherit',
    });
  });

  afterAll(() => {
    if (isCiWorkflow()) {
      return;
    }

    try {
      rimraf.sync('node_modules/@ngworker/lumberjack');
    } catch {
      // it's okay if it this directory doesn't exist
    }
  });

  it('default options', () => {
    const expectedAppModule = readFileSync(
      path.resolve(__dirname, './golden-files/default-options-app.module.golden')
    ).toString('utf-8');

    execSync('yarn run ng add @ngworker/lumberjack --project=lumberjack-schematics-app', {
      stdio: 'inherit',
    });

    const actualAppModule = readFileSync('apps/lumberjack-schematics-app/src/app/app.module.ts').toString('utf-8');
    expect(actualAppModule).toBe(expectedAppModule);
  });
});
