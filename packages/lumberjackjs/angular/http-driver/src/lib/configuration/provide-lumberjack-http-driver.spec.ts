import { HttpHandlerFn, HttpRequest, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { createDriverLog, createFakeTime, Writable } from '@internal/core/test-util';
import { lumberjackLogDriverToken, provideLumberjack } from '@lumberjackjs/angular';
import { LumberjackConfigLevels, LumberjackLevel, LumberjackLogDriver } from '@lumberjackjs/core';

import { LumberjackHttpDriver } from '../log-drivers/lumberjack-http.driver';

import { LumberjackHttpDriverInternalConfig } from './lumberjack-http-driver-internal.config';
import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';
import { LumberjackHttpDriverOptions } from './lumberjack-http-driver.options';
import {
  HttpClientFeatures,
  provideLumberjackHttpDriver,
  withHttpConfig,
  withHttpOptions,
} from './provide-lumberjack-http-driver';

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
  const config: Writable<LumberjackHttpDriverConfig> = {
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
    features = [],
  }: {
    config: LumberjackHttpDriverConfig;
    isLumberjackModuleProvidedFirst?: boolean;
    features?: HttpClientFeatures;
  } = {
    config: createHttpConfig([LumberjackLevel.Verbose], LumberjackHttpDriver.driverIdentifier),
  }
) => {
  TestBed.configureTestingModule({
    providers: [
      isLumberjackModuleProvidedFirst ? provideLumberjack() : [],
      provideLumberjackHttpDriver(withHttpConfig(config), ...features),
      isLumberjackModuleProvidedFirst ? [] : provideLumberjack(),
    ],
  });

  const [httpDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];

  return httpDriver;
};

const createHttpDriverWithOptions = (
  {
    isLumberjackModuleProvidedFirst = true,
    options,
    features = [],
  }: {
    isLumberjackModuleProvidedFirst?: boolean;
    options: LumberjackHttpDriverOptions;
    features?: HttpClientFeatures;
  } = { options: createHttpOptions() }
) => {
  TestBed.configureTestingModule({
    providers: [
      isLumberjackModuleProvidedFirst ? provideLumberjack() : [],
      provideLumberjackHttpDriver(withHttpOptions(options), ...features),
      isLumberjackModuleProvidedFirst ? [] : provideLumberjack(),
    ],
  });

  const [httpDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];

  return httpDriver;
};

const fakeTime = createFakeTime();

describe(provideLumberjackHttpDriver.name, () => {
  it('provides the HTTP driver', () => {
    const httpDriver = createHttpDriver();

    expect(httpDriver).toBeInstanceOf(LumberjackHttpDriver);
  });

  describe(withHttpConfig.name, () => {
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

    it('registers the specified log driver configuration WITH HttpClient features', () => {
      const testInterceptor = jest.fn((req: HttpRequest<unknown>, next: HttpHandlerFn) => next(req));
      const config = createHttpConfig([LumberjackLevel.Error]);
      const features: HttpClientFeatures = [withInterceptors([testInterceptor])];
      const httpDriver = createHttpDriver({ config, features });
      const log = createDriverLog(
        fakeTime.getUnixEpochTicks.bind(fakeTime),
        LumberjackLevel.Info,
        LumberjackLevel.Info,
        '',
        'Test Log'
      );

      httpDriver.logInfo(log);

      expect(testInterceptor).toHaveBeenCalled();
    });
  });

  describe(withHttpOptions.name, () => {
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

    it('does register the specified log driver options WITH HttpClient features', () => {
      const testInterceptor = jest.fn((req, next) => next(req));
      const features: HttpClientFeatures = [withInterceptors([testInterceptor])];
      const customLevels: LumberjackConfigLevels = [LumberjackLevel.Critical];
      const options = createHttpOptions({ levels: customLevels });

      const httpDriver = createHttpDriverWithOptions({ options, features });
      const log = createDriverLog(
        fakeTime.getUnixEpochTicks.bind(fakeTime),
        LumberjackLevel.Info,
        LumberjackLevel.Info,
        '',
        'Test Log'
      );

      httpDriver.logInfo(log);

      expect(testInterceptor).toHaveBeenCalled();
    });
  });
});
