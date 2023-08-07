import { TestBed } from '@angular/core/testing';

import { lumberjackConfigToken, lumberjackLogDriverToken, provideLumberjack } from '@lumberjackjs/angular';
import { LumberjackLevel, LumberjackLogDriver, LumberjackLogDriverConfig } from '@lumberjackjs/core';

import { LumberjackConsoleDriver } from '../log-drivers/lumberjack-console.driver';

import { LumberjackConsoleDriverConfig } from './lumberjack-console-driver.config';
import { provideLumberjackConsoleDriver } from './provide-lumberjack-console-driver';

const createConsoleDriver = ({
  config,
  isLumberjackModuleProvidedFirst = true,
}: {
  config?: LumberjackConsoleDriverConfig;
  isLumberjackModuleProvidedFirst?: boolean;
} = {}) => {
  TestBed.configureTestingModule({
    providers: [
      isLumberjackModuleProvidedFirst ? provideLumberjack() : [],
      provideLumberjackConsoleDriver(config),
      isLumberjackModuleProvidedFirst ? [] : provideLumberjack(),
    ],
  });

  const [consoleDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];

  return consoleDriver;
};

describe(provideLumberjackConsoleDriver.name, () => {
  it('provides the console driver', () => {
    const consoleDriver = createConsoleDriver();

    expect(consoleDriver).toBeInstanceOf(LumberjackConsoleDriver);
  });

  it('registers the specified log driver configuration given the specified identifier', () => {
    const expectedConfig: LumberjackLogDriverConfig = {
      levels: [LumberjackLevel.Error],
      identifier: 'TestDriverIdentifier',
    };

    const consoleDriver = createConsoleDriver({ config: expectedConfig });

    const actualConfig = consoleDriver.config;
    expect(actualConfig).toEqual(expectedConfig);
  });

  it('registers the specified log driver configuration given no identifier', () => {
    const config: LumberjackConsoleDriverConfig = {
      levels: [LumberjackLevel.Error],
    };
    const expectedConfig: LumberjackLogDriverConfig = {
      ...config,
      identifier: LumberjackConsoleDriver.driverIdentifier,
    };

    const consoleDriver = createConsoleDriver({ config });

    const actualConfig = consoleDriver.config;
    expect(actualConfig).toEqual(expectedConfig);
  });

  it('registers a default configuration if none is specified', () => {
    const consoleDriver = createConsoleDriver();

    const actualConfig = consoleDriver.config;
    const logConfig = TestBed.inject(lumberjackConfigToken);
    const defaultLogDriverConfig: LumberjackLogDriverConfig = {
      levels: logConfig.levels,
      identifier: LumberjackConsoleDriver.driverIdentifier,
    };
    expect(actualConfig).toEqual(defaultLogDriverConfig);
  });

  it('registers the specified log driver configuration when the Lumberjack module is imported after the console driver module', () => {
    const expectedConfig: LumberjackLogDriverConfig = {
      levels: [LumberjackLevel.Debug],
      identifier: 'TestConsoleDriver',
    };

    const consoleDriver = createConsoleDriver({
      config: expectedConfig,
      isLumberjackModuleProvidedFirst: false,
    });

    const actualConfig = consoleDriver.config;
    expect(actualConfig).toEqual(expectedConfig);
  });
});
