import { TestBed } from '@angular/core/testing';

import { expectNgModuleToBeGuardedAgainstDirectImport, resolveDependency } from '@internal/test-util';
import {
  lumberjackConfigToken,
  LumberjackLevel,
  LumberjackLogDriver,
  LumberjackLogDriverConfig,
  lumberjackLogDriverToken,
  LumberjackModule,
} from '@ngworker/lumberjack';

import { LumberjackConsoleDriver } from '../log-drivers/lumberjack-console.driver';

import { LumberjackConsoleDriverConfig } from './lumberjack-console-driver.config';
import { LumberjackConsoleDriverModule } from './lumberjack-console-driver.module';

const createConsoleDriver = ({
  config,
  isLumberjackModuleImportedFirst = true,
}: {
  config?: LumberjackConsoleDriverConfig;
  isLumberjackModuleImportedFirst?: boolean;
} = {}) => {
  TestBed.configureTestingModule({
    imports: [
      isLumberjackModuleImportedFirst ? LumberjackModule.forRoot() : [],
      LumberjackConsoleDriverModule.forRoot(config),
      isLumberjackModuleImportedFirst ? [] : LumberjackModule.forRoot(),
    ],
  });

  const [consoleDriver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];

  return consoleDriver;
};

describe(LumberjackConsoleDriverModule.name, () => {
  it(`cannot be imported without using the ${LumberjackConsoleDriverModule.forRoot.name} method`, () => {
    expectNgModuleToBeGuardedAgainstDirectImport(LumberjackConsoleDriverModule);
  });

  describe(LumberjackConsoleDriverModule.forRoot.name, () => {
    it('provides the console driver', () => {
      const consoleDriver = createConsoleDriver();

      expect(consoleDriver).toBeInstanceOf(LumberjackConsoleDriver);
    });

    it('registers the specified log driver configuration WITH the identifier', () => {
      const expectedConfig: LumberjackLogDriverConfig = {
        levels: [LumberjackLevel.Error],
        identifier: 'uuid',
      };

      const consoleDriver = createConsoleDriver({ config: expectedConfig });

      const actualConfig = consoleDriver.config;
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('registers the specified log driver configuration WITHOUT the identifier', () => {
      const config: LumberjackConsoleDriverConfig = {
        levels: [LumberjackLevel.Error],
      };
      const expectedConfig: LumberjackLogDriverConfig = { ...config, identifier: LumberjackConsoleDriver.name };

      const consoleDriver = createConsoleDriver({ config });

      const actualConfig = consoleDriver.config;
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('registers a default configuration if none is specified', () => {
      const consoleDriver = createConsoleDriver();

      const actualConfig = consoleDriver.config;
      const logConfig = resolveDependency(lumberjackConfigToken);
      const defaultLogDriverConfig: LumberjackLogDriverConfig = {
        levels: logConfig.levels,
        identifier: LumberjackConsoleDriver.name,
      };
      expect(actualConfig).toEqual(defaultLogDriverConfig);
    });

    it('does register the specified log driver configuration when the lumberjack module is imported after the console driver module', () => {
      const expectedConfig: LumberjackLogDriverConfig = {
        levels: [LumberjackLevel.Debug],
        identifier: 'uuid',
      };

      const consoleDriver = createConsoleDriver({
        config: expectedConfig,
        isLumberjackModuleImportedFirst: false,
      });

      const actualConfig = consoleDriver.config;
      expect(actualConfig).toEqual(expectedConfig);
    });
  });
});
