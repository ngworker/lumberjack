import { execSync } from 'child_process';
import * as copy from 'copy';
import { mkdirSync, readFileSync } from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';

function isCiWorkflow(): boolean {
  return process.env.CI === 'TRUE';
}

function normalizeNewlines(text: string): string {
  return text.replace(/\r\n?/g, '\n');
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

    await new Promise((resolve, reject) => {
      copy(
        'dist/ngworker/lumberjack/**',
        'node_modules/@ngworker/lumberjack',
        { cwd: process.cwd() },
        (error, files) => {
          if (error) {
            reject(error);

            return;
          }

          resolve(files);
        }
      );
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
    const expectedAppModule = normalizeNewlines(
      readFileSync(path.resolve(__dirname, './golden-files/default-options/app.module.ts.golden')).toString('utf-8')
    );

    execSync('yarn run ng add @ngworker/lumberjack --project=lumberjack-schematics-app', {
      stdio: 'inherit',
    });

    const actualAppModule = normalizeNewlines(
      readFileSync('apps/lumberjack-schematics-app/src/app/app.module.ts').toString('utf-8')
    );
    expect(actualAppModule).toBe(expectedAppModule);
  });

  it('with console driver', () => {
    const expectedAppModule = normalizeNewlines(
      readFileSync(path.resolve(__dirname, './golden-files/with-console-driver/app.module.ts.golden')).toString('utf-8')
    );

    execSync('yarn run ng add @ngworker/lumberjack --project=lumberjack-schematics-app --console-driver', {
      stdio: 'inherit',
    });

    const actualAppModule = normalizeNewlines(
      readFileSync('apps/lumberjack-schematics-app/src/app/app.module.ts').toString('utf-8')
    );
    expect(actualAppModule).toBe(expectedAppModule);
  });

  it('with HTTP driver', () => {
    const expectedAppModule = normalizeNewlines(
      readFileSync(path.resolve(__dirname, './golden-files/with-http-driver/app.module.ts.golden')).toString('utf-8')
    );

    execSync('yarn run ng add @ngworker/lumberjack --project=lumberjack-schematics-app --http-driver', {
      stdio: 'inherit',
    });

    const actualAppModule = normalizeNewlines(
      readFileSync('apps/lumberjack-schematics-app/src/app/app.module.ts').toString('utf-8')
    );
    expect(actualAppModule).toBe(expectedAppModule);
  });

  it('with console driver and HTTP driver', () => {
    const expectedAppModule = normalizeNewlines(
      readFileSync(
        path.resolve(__dirname, './golden-files/with-console-driver-and-http-driver/app.module.ts.golden')
      ).toString('utf-8')
    );

    execSync(
      'yarn run ng add @ngworker/lumberjack --project=lumberjack-schematics-app --console-driver --http-driver',
      {
        stdio: 'inherit',
      }
    );

    const actualAppModule = normalizeNewlines(
      readFileSync('apps/lumberjack-schematics-app/src/app/app.module.ts').toString('utf-8')
    );
    expect(actualAppModule).toBe(expectedAppModule);
  });
});
