import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { O } from 'ts-toolbelt';

import {
  LumberjackConfigLevels,
  LumberjackLevel,
  LumberjackLogDriver,
  lumberjackLogDriverToken,
  provideLumberjack,
} from '@ngworker/lumberjack';
import { resolveDependency } from '@internal/test-util';

import { LumberjackHttpDriver } from '../log-drivers/lumberjack-http.driver';

import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';
import { provideLumberjackHttpDriver, withConfig, withOptions } from './provide-lumberjack-http-driver';
import { LumberjackHttpDriverInternalConfig } from './lumberjack-http-driver-internal.config';
import { LumberjackHttpDriverOptions } from './lumberjack-http-driver.options';

function createHttpOptions(
  extraOptions: { levels?: LumberjackConfigLevels; identifier?: string } = {}
): LumberjackHttpDriverOptions {
  return {
    origin: 'TEST_MODULE',
    retryOptions: { maxRetries: 5, delayMs: 250 },
    storeUrl: 'api/logstore',
    ...extraOptions,
  };
}

function createHttpConfig(levels: LumberjackConfigLevels, identifier?: string): LumberjackHttpDriverConfig {
  const config: O.Writable<LumberjackHttpDriverConfig, 'identifier'> = {
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
    isLumberjackModuleProvidedFirst = true,
  }: {
    config: LumberjackHttpDriverConfig;
    isLumberjackModuleProvidedFirst?: boolean;
  } = {
    config: createHttpConfig([LumberjackLevel.Verbose], LumberjackHttpDriver.driverIdentifier),
  }
) => {
  TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [
      isLumberjackModuleProvidedFirst ? provideLumberjack() : [],
      provideLumberjackHttpDriver(withConfig(config)),
      isLumberjackModuleProvidedFirst ? [] : provideLumberjack(),
    ],
  });

  const [httpDriver] = resolveDependency(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];

  return httpDriver;
};

const createHttpDriverWithOptions = (
  {
    isLumberjackModuleProvidedFirst = true,
    options,
  }: {
    isLumberjackModuleProvidedFirst?: boolean;
    options: LumberjackHttpDriverOptions;
  } = { options: createHttpOptions() }
) => {
  TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [
      isLumberjackModuleProvidedFirst ? provideLumberjack() : [],
      provideLumberjackHttpDriver(withOptions(options)),
      isLumberjackModuleProvidedFirst ? [] : provideLumberjack(),
    ],
  });

  const [httpDriver] = resolveDependency(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];

  return httpDriver;
};

describe(provideLumberjackHttpDriver.name, () => {
  it('provides the HTTP driver', () => {
    const httpDriver = createHttpDriver();

    expect(httpDriver).toBeInstanceOf(LumberjackHttpDriver);
  });

  describe(withConfig.name, () => {
    it('registers the specified log driver configuration WITH a specified identifier', () => {
      const expectedConfig = createHttpConfig([LumberjackLevel.Error], 'TestDriverIdentifier');

      const httpDriver = createHttpDriver({ config: expectedConfig });

      const actualConfig = httpDriver.config;
      expect(actualConfig).toEqual(expectedConfig as LumberjackHttpDriverInternalConfig);
    });

    it('registers the specified log driver configuration WITHOUT a specified identifier', () => {
      const config = createHttpConfig([LumberjackLevel.Error]);
      const expectedConfig = { ...config, identifier: LumberjackHttpDriver.driverIdentifier };
      const httpDriver = createHttpDriver({ config });

      const actualConfig = httpDriver.config;
      expect(actualConfig).toEqual(expectedConfig as LumberjackHttpDriverInternalConfig);
    });

    it('does register the specified log driver configuration when the lumberjack module is imported after the http driver module', () => {
      const expectedConfig = createHttpConfig([LumberjackLevel.Debug], 'TestDriverIdentifier');

      const httpDriver = createHttpDriver({
        config: expectedConfig,
        isLumberjackModuleProvidedFirst: false,
      });

      const actualConfig = httpDriver.config;
      expect(actualConfig).toEqual(expectedConfig as LumberjackHttpDriverInternalConfig);
    });
  });

  describe(withOptions.name, () => {
    it('registers the specified options', () => {
      const options = createHttpOptions();

      const httpDriver = createHttpDriverWithOptions({ options });

      const actualConfig = httpDriver.config;
      const expectedConfig: LumberjackHttpDriverInternalConfig = {
        ...options,
        levels: [LumberjackLevel.Verbose],
        identifier: 'LumberjackHttpDriver',
      };
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('registers the specified options with custom levels', () => {
      const customLevels: LumberjackConfigLevels = [LumberjackLevel.Critical];
      const options = createHttpOptions({ levels: customLevels });

      const httpDriver = createHttpDriverWithOptions({ options });

      const actualConfig = httpDriver.config;
      const expectedConfig: LumberjackHttpDriverInternalConfig = {
        ...options,
        levels: customLevels,
        identifier: 'LumberjackHttpDriver',
      };
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('registers the specified options with custom identifier', () => {
      const customIdentifier = 'TestDriverIdentifier';
      const options = createHttpOptions({ identifier: customIdentifier });

      const httpDriver = createHttpDriverWithOptions({ options });

      const actualConfig = httpDriver.config;
      const expectedConfig: LumberjackHttpDriverInternalConfig = {
        ...options,
        levels: [LumberjackLevel.Verbose],
        identifier: customIdentifier,
      };
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('gets default options from the log driver config', () => {
      const options = createHttpOptions();

      const httpDriver = createHttpDriverWithOptions({ options });

      const { levels, identifier } = httpDriver.config;
      expect(levels).toEqual([LumberjackLevel.Verbose]);
      expect(identifier).toEqual(LumberjackHttpDriver.driverIdentifier);
    });

    it('does register the specified log driver configuration when the lumberjack module is imported after the http driver module', () => {
      const options = createHttpOptions();

      const httpDriver = createHttpDriverWithOptions({
        options,
        isLumberjackModuleProvidedFirst: false,
      });

      const actualConfig = httpDriver.config;
      const expectedConfig: LumberjackHttpDriverInternalConfig = {
        ...options,
        levels: [LumberjackLevel.Verbose],
        identifier: LumberjackHttpDriver.driverIdentifier,
      };
      expect(actualConfig).toEqual(expectedConfig);
    });
  });
});
