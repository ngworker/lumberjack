import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import * as path from 'path';

import { normalizeNewlines, setUpTestEnvironment, tearDownTestCase, tearDownTestEnvironment } from '@internal/e2e-util';

describe('@ngworker/lumberjack:log-driver e2e', () => {
  beforeAll(async () => {
    await setUpTestEnvironment();
  });

  afterEach(() => {
    tearDownTestCase();
  });

  afterAll(() => {
    tearDownTestEnvironment();
  });

  it('generated token files should match', () => {
    const expectedSpecToken = normalizeNewlines(
      readFileSync(
        path.resolve(__dirname, './golden-files/configuration/console-driver-config.token.spec.ts.golden')
      ).toString('utf-8')
    );

    const expectedToken = normalizeNewlines(
      readFileSync(
        path.resolve(__dirname, './golden-files/configuration/console-driver-config.token.ts.golden')
      ).toString('utf-8')
    );

    execSync(
      'yarn run ng generate @ngworker/lumberjack:log-driver --project=lumberjack-schematics-app --name=console',
      {
        stdio: 'inherit',
      }
    );

    const actualSpecToken = normalizeNewlines(
      readFileSync(
        'apps/lumberjack-schematics-app/src/app/console-driver/configuration/console-driver-config.token.spec.ts'
      ).toString('utf-8')
    );

    const actualToken = normalizeNewlines(
      readFileSync(
        'apps/lumberjack-schematics-app/src/app/console-driver/configuration/console-driver-config.token.ts'
      ).toString('utf-8')
    );

    expect(actualSpecToken).toBe(expectedSpecToken);
    expect(actualToken).toBe(expectedToken);
  });

  it('generated token code should match', () => {
    const expectedConfigToken = normalizeNewlines(
      readFileSync(path.resolve(__dirname, './golden-files/configuration/console-driver-config.ts.golden')).toString(
        'utf-8'
      )
    );

    execSync(
      'yarn run ng generate @ngworker/lumberjack:log-driver --project=lumberjack-schematics-app --name=console',
      {
        stdio: 'inherit',
      }
    );

    const actualConfigToken = normalizeNewlines(
      readFileSync(
        'apps/lumberjack-schematics-app/src/app/console-driver/configuration/console-driver.config.ts'
      ).toString('utf-8')
    );

    expect(actualConfigToken).toBe(expectedConfigToken);
  });

  it('generated console driver root module file should match', () => {
    const expectedRootModuleSpec = normalizeNewlines(
      readFileSync(
        path.resolve(__dirname, './golden-files/configuration/console-driver-root.module.spec.ts.golden')
      ).toString('utf-8')
    );

    const expectedRootModule = normalizeNewlines(
      readFileSync(
        path.resolve(__dirname, './golden-files/configuration/console-driver-root.module.ts.golden')
      ).toString('utf-8')
    );

    execSync(
      'yarn run ng generate @ngworker/lumberjack:log-driver --project=lumberjack-schematics-app --name=console',
      {
        stdio: 'inherit',
      }
    );

    const actualRootModuleSpec = normalizeNewlines(
      readFileSync(
        'apps/lumberjack-schematics-app/src/app/console-driver/configuration/console-driver-root.module.spec.ts'
      ).toString('utf-8')
    );

    const actualRootModule = normalizeNewlines(
      readFileSync(
        'apps/lumberjack-schematics-app/src/app/console-driver/configuration/console-driver-root.module.ts'
      ).toString('utf-8')
    );

    expect(actualRootModuleSpec).toBe(expectedRootModuleSpec);
    expect(actualRootModule).toBe(expectedRootModule);
  });

  it('generated console driver module file should match', () => {
    const expectedModuleSpec = normalizeNewlines(
      readFileSync(
        path.resolve(__dirname, './golden-files/configuration/console-driver.module.spec.ts.golden')
      ).toString('utf-8')
    );

    const expectedModule = normalizeNewlines(
      readFileSync(path.resolve(__dirname, './golden-files/configuration/console-driver.module.ts.golden')).toString(
        'utf-8'
      )
    );

    execSync(
      'yarn run ng generate @ngworker/lumberjack:log-driver --project=lumberjack-schematics-app --name=console',
      {
        stdio: 'inherit',
      }
    );

    const actualModuleSpec = normalizeNewlines(
      readFileSync(
        'apps/lumberjack-schematics-app/src/app/console-driver/configuration/console-driver.module.spec.ts'
      ).toString('utf-8')
    );

    const actualModule = normalizeNewlines(
      readFileSync(
        'apps/lumberjack-schematics-app/src/app/console-driver/configuration/console-driver.module.ts'
      ).toString('utf-8')
    );

    expect(actualModuleSpec).toBe(expectedModuleSpec);
    expect(actualModule).toBe(expectedModule);
  });
});
