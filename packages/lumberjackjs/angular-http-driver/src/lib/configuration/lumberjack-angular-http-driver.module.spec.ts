import { TestBed } from '@angular/core/testing';

import { expectNgModuleToBeGuardedAgainstDirectImport } from '@internal/angular/test-util';
import { lumberjackDriverToken, LumberjackModule } from '@lumberjackjs/angular';
import { LumberjackConfigLevels, LumberjackDriver, LumberjackLevel } from '@lumberjackjs/core';

import { LumberjackAngularHttpDriver } from '../drivers/lumberjack-angular-http.driver';

import { LumberjackAngularHttpDriverInternalConfig } from './lumberjack-angular-http-driver-internal.config';
import { LumberjackAngularHttpDriverConfig } from './lumberjack-angular-http-driver.config';
import { LumberjackAngularHttpDriverModule } from './lumberjack-angular-http-driver.module';
import { LumberjackAngularHttpDriverOptions } from './lumberjack-angular-http-driver.options';

function createHttpOptions(
  extraOptions: { levels?: LumberjackConfigLevels; identifier?: string } = {}
): LumberjackAngularHttpDriverOptions {
  return {
    origin: 'TEST_MODULE',
    retryOptions: { maxRetries: 5, delayMs: 250 },
    storeUrl: 'api/logstore',
    ...extraOptions,
  };
}

function createHttpConfig(levels: LumberjackConfigLevels, identifier?: string): LumberjackAngularHttpDriverConfig {
  const config = {
    levels,
    origin: 'TEST_MODULE',
    retryOptions: { maxRetries: 5, delayMs: 250 },
    storeUrl: 'api/logstore',
    identifier,
  };

  if (!identifier) {
    delete config.identifier;
  }

  return config;
}

const createHttpDriver = (
  {
    config,
    isLumberjackModuleImportedFirst = true,
  }: {
    config: LumberjackAngularHttpDriverConfig;
    isLumberjackModuleImportedFirst?: boolean;
  } = {
    config: createHttpConfig([LumberjackLevel.Verbose], LumberjackAngularHttpDriver.driverIdentifier),
  }
) => {
  TestBed.configureTestingModule({
    imports: [
      isLumberjackModuleImportedFirst ? LumberjackModule.forRoot() : [],
      LumberjackAngularHttpDriverModule.forRoot(config),
      isLumberjackModuleImportedFirst ? [] : LumberjackModule.forRoot(),
    ],
  });

  const [httpDriver] = TestBed.inject(lumberjackDriverToken) as unknown as LumberjackDriver[];

  return httpDriver;
};

const createHttpDriverWithOptions = (
  {
    isLumberjackModuleImportedFirst = true,
    options,
  }: {
    isLumberjackModuleImportedFirst?: boolean;
    options: LumberjackAngularHttpDriverOptions;
  } = { options: createHttpOptions() }
) => {
  TestBed.configureTestingModule({
    imports: [
      isLumberjackModuleImportedFirst ? LumberjackModule.forRoot() : [],
      LumberjackAngularHttpDriverModule.withOptions(options),
      isLumberjackModuleImportedFirst ? [] : LumberjackModule.forRoot(),
    ],
  });

  const [httpDriver] = TestBed.inject(lumberjackDriverToken) as unknown as LumberjackDriver[];

  return httpDriver;
};

describe(LumberjackAngularHttpDriverModule.name, () => {
  it(`cannot be imported without using the ${LumberjackAngularHttpDriverModule.forRoot.name} method`, () => {
    expectNgModuleToBeGuardedAgainstDirectImport(LumberjackAngularHttpDriverModule);
  });

  describe(LumberjackAngularHttpDriverModule.forRoot.name, () => {
    it('provides the HTTP driver', () => {
      const httpDriver = createHttpDriver();

      expect(httpDriver).toBeInstanceOf(LumberjackAngularHttpDriver);
    });

    it('registers the specified driver configuration WITH a specified identifier', () => {
      const expectedConfig = createHttpConfig([LumberjackLevel.Error], 'TestDriverIdentifier');

      const httpDriver = createHttpDriver({ config: expectedConfig });

      const actualConfig = httpDriver.config;
      expect(actualConfig).toEqual(expectedConfig as LumberjackAngularHttpDriverInternalConfig);
    });

    it('registers the specified driver configuration WITHOUT a specified identifier', () => {
      const config = createHttpConfig([LumberjackLevel.Error]);
      const expectedConfig = { ...config, identifier: LumberjackAngularHttpDriver.driverIdentifier };
      const httpDriver = createHttpDriver({ config });

      const actualConfig = httpDriver.config;
      expect(actualConfig).toEqual(expectedConfig as LumberjackAngularHttpDriverInternalConfig);
    });

    it('does register the specified driver configuration when the lumberjack module is imported after the http driver module', () => {
      const expectedConfig = createHttpConfig([LumberjackLevel.Debug], 'TestDriverIdentifier');

      const httpDriver = createHttpDriver({
        config: expectedConfig,
        isLumberjackModuleImportedFirst: false,
      });

      const actualConfig = httpDriver.config;
      expect(actualConfig).toEqual(expectedConfig as LumberjackAngularHttpDriverInternalConfig);
    });
  });

  describe(LumberjackAngularHttpDriverModule.withOptions.name, () => {
    it('provides the HTTP driver', () => {
      const httpDriver = createHttpDriverWithOptions();

      expect(httpDriver).toBeInstanceOf(LumberjackAngularHttpDriver);
    });

    it('registers the specified options', () => {
      const options = createHttpOptions();

      const httpDriver = createHttpDriverWithOptions({ options });

      const actualConfig = httpDriver.config;
      const expectedConfig: LumberjackAngularHttpDriverInternalConfig = {
        ...options,
        levels: [LumberjackLevel.Verbose],
        identifier: 'LumberjackAngularHttpDriver',
      };
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('registers the specified options with custom levels', () => {
      const customLevels: LumberjackConfigLevels = [LumberjackLevel.Critical];
      const options = createHttpOptions({ levels: customLevels });

      const httpDriver = createHttpDriverWithOptions({ options });

      const actualConfig = httpDriver.config;
      const expectedConfig: LumberjackAngularHttpDriverInternalConfig = {
        ...options,
        levels: customLevels,
        identifier: 'LumberjackAngularHttpDriver',
      };
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('registers the specified options with custom identifier', () => {
      const customIdentifier = 'TestDriverIdentifier';
      const options = createHttpOptions({ identifier: customIdentifier });

      const httpDriver = createHttpDriverWithOptions({ options });

      const actualConfig = httpDriver.config;
      const expectedConfig: LumberjackAngularHttpDriverInternalConfig = {
        ...options,
        levels: [LumberjackLevel.Verbose],
        identifier: customIdentifier,
      };
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('gets default options from the driver config', () => {
      const options = createHttpOptions();

      const httpDriver = createHttpDriverWithOptions({ options });

      const { levels, identifier } = httpDriver.config;
      expect(levels).toEqual([LumberjackLevel.Verbose]);
      expect(identifier).toEqual(LumberjackAngularHttpDriver.driverIdentifier);
    });

    it('does register the specified driver configuration when the lumberjack module is imported after the http driver module', () => {
      const options = createHttpOptions();

      const httpDriver = createHttpDriverWithOptions({
        options,
        isLumberjackModuleImportedFirst: false,
      });

      const actualConfig = httpDriver.config;
      const expectedConfig: LumberjackAngularHttpDriverInternalConfig = {
        ...options,
        levels: [LumberjackLevel.Verbose],
        identifier: LumberjackAngularHttpDriver.driverIdentifier,
      };
      expect(actualConfig).toEqual(expectedConfig);
    });
  });
});
