import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import * as path from 'path';

import { normalizeNewlines, setUpTestEnvironment, tearDownTestCase, tearDownTestEnvironment } from '@internal/e2e-util';

describe('@ngworker/lumberjack:ng-add e2e', () => {
  beforeAll(async () => {
    await setUpTestEnvironment();
  });

  afterEach(() => {
    tearDownTestCase();
  });

  afterAll(() => {
    tearDownTestEnvironment();
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

  it('without log drivers', () => {
    const expectedAppModule = normalizeNewlines(
      readFileSync(path.resolve(__dirname, './golden-files/no-drivers/app.module.ts.golden')).toString('utf-8')
    );

    execSync(
      'yarn run ng add @ngworker/lumberjack --project=lumberjack-schematics-app --console-driver=false --http-driver=false',
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
