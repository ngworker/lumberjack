import { TestBed } from '@angular/core/testing';

import { expectNgModuleToBeGuarded, resolveDependency } from '@internal/test-util';
import {
  LogDriver,
  LogDriverConfig,
  logDriverToken,
  lumberjackLogConfigToken,
  LumberjackLogLevel,
  LumberjackModule,
} from '@ngworker/lumberjack';

import { ConsoleDriverModule } from './console-driver.module';
import { ConsoleDriver } from './console.driver';

const createConsoleDriver = ({
  config,
  isLumberjackModuleImportedFirst = true,
}: {
  config?: LogDriverConfig;
  isLumberjackModuleImportedFirst?: boolean;
} = {}) => {
  TestBed.configureTestingModule({
    imports: [
      isLumberjackModuleImportedFirst ? LumberjackModule.forRoot() : [],
      ConsoleDriverModule.forRoot(config),
      isLumberjackModuleImportedFirst ? [] : LumberjackModule.forRoot(),
    ],
  });

  const [consoleDriver] = (resolveDependency(logDriverToken) as unknown) as LogDriver[];

  return consoleDriver;
};

describe(ConsoleDriverModule.name, () => {
  it(`cannot be imported without using the ${ConsoleDriverModule.forRoot.name} method`, () => {
    expectNgModuleToBeGuarded(ConsoleDriverModule);
  });

  describe(ConsoleDriverModule.forRoot.name, () => {
    it('provides the console driver', () => {
      const consoleDriver = createConsoleDriver();

      expect(consoleDriver).toBeInstanceOf(ConsoleDriver);
    });

    it('registers the specified log driver configuration', () => {
      const expectedConfig: LogDriverConfig = {
        levels: [LumberjackLogLevel.Error],
      };

      const consoleDriver = createConsoleDriver({ config: expectedConfig });

      const actualConfig = consoleDriver.config;
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('registers a default configuration if none is specified', () => {
      const consoleDriver = createConsoleDriver();

      const actualConfig = consoleDriver.config;
      const logConfig = resolveDependency(lumberjackLogConfigToken);
      const defaultLogDriverConfig: LogDriverConfig = {
        levels: logConfig.levels,
      };
      expect(actualConfig).toEqual(defaultLogDriverConfig);
    });

    it('does register the specified log driver configuration when the lumberjack module is imported after the console driver module', () => {
      const expectedConfig: LogDriverConfig = {
        levels: [LumberjackLogLevel.Debug],
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
