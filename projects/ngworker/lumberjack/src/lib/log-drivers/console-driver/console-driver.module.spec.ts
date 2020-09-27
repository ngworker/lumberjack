import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { defaultLogDriverConfig, LogDriverConfig } from '../../configs/log-driver.config';
import { LumberjackLogLevel } from '../../lumberjack-log-levels';
import { LumberjackModule } from '../../lumberjack.module';
import { LogDriver, LogDriverToken } from '../log-driver';

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

  const [consoleDriver] = (TestBed.inject(LogDriverToken) as unknown) as LogDriver[];

  return consoleDriver;
};

const expectNgModuleToBeImported = <TModule>(ngModuleType: Type<TModule>) => {
  let ngModule: TModule | undefined;

  expect(() => {
    ngModule = TestBed.inject(ngModuleType);
  })
    .withContext(`${ngModuleType.name} has not been imported`)
    .not.toThrowError(new RegExp(`NullInjectorError.*${ngModuleType.name}`));

  expect(ngModule).toBeInstanceOf(ngModuleType);
};

describe(ConsoleDriverModule.name, () => {
  it(`can be imported without using the ${ConsoleDriverModule.forRoot.name} method`, () => {
    TestBed.configureTestingModule({
      imports: [ConsoleDriverModule],
    });

    expectNgModuleToBeImported(ConsoleDriverModule);
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
      const expectedConfig = defaultLogDriverConfig;

      const consoleDriver = createConsoleDriver();

      const actualConfig = consoleDriver.config;
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('does not register the specified log driver configuration when the lumberjack module is imported after the console driver module', () => {
      const expectedConfig: LogDriverConfig = {
        levels: [LumberjackLogLevel.Debug],
      };

      const consoleDriver = createConsoleDriver({
        config: expectedConfig,
        isLumberjackModuleImportedFirst: false,
      });

      const actualConfig = consoleDriver.config;
      expect(actualConfig).not.toEqual(expectedConfig);
    });
  });
});
