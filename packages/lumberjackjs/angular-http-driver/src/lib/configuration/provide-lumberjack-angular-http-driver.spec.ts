import { HttpHandlerFn, HttpRequest, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { createDriverLog, createFakeTime, Writable } from '@internal/core/test-util';
import { lumberjackDriverToken, provideLumberjack } from '@lumberjackjs/angular';
import { LumberjackConfigLevels, LumberjackDriver, LumberjackLevel } from '@lumberjackjs/core';

import { LumberjackAngularHttpDriver } from '../drivers/lumberjack-angular-http.driver';

import { LumberjackAngularHttpDriverInternalConfig } from './lumberjack-angular-http-driver-internal.config';
import { LumberjackAngularHttpDriverConfig } from './lumberjack-angular-http-driver.config';
import { LumberjackAngularHttpDriverOptions } from './lumberjack-angular-http-driver.options';
import {
  HttpClientFeatures,
  provideLumberjackAngularHttpDriver,
  withHttpConfig,
  withHttpOptions,
} from './provide-lumberjack-angular-http-driver';

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
  const config: Writable<LumberjackAngularHttpDriverConfig> = {
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
    config: LumberjackAngularHttpDriverConfig;
    isLumberjackModuleProvidedFirst?: boolean;
    features?: HttpClientFeatures;
  } = {
    config: createHttpConfig([LumberjackLevel.Verbose], LumberjackAngularHttpDriver.driverIdentifier),
  }
) => {
  TestBed.configureTestingModule({
    providers: [
      isLumberjackModuleProvidedFirst ? provideLumberjack() : [],
      provideLumberjackAngularHttpDriver(withHttpConfig(config), ...features),
      isLumberjackModuleProvidedFirst ? [] : provideLumberjack(),
    ],
  });

  const [httpDriver] = TestBed.inject(lumberjackDriverToken) as unknown as LumberjackDriver[];

  return httpDriver;
};

const createHttpDriverWithOptions = (
  {
    isLumberjackModuleProvidedFirst = true,
    options,
    features = [],
  }: {
    isLumberjackModuleProvidedFirst?: boolean;
    options: LumberjackAngularHttpDriverOptions;
    features?: HttpClientFeatures;
  } = { options: createHttpOptions() }
) => {
  TestBed.configureTestingModule({
    providers: [
      isLumberjackModuleProvidedFirst ? provideLumberjack() : [],
      provideLumberjackAngularHttpDriver(withHttpOptions(options), ...features),
      isLumberjackModuleProvidedFirst ? [] : provideLumberjack(),
    ],
  });

  const [httpDriver] = TestBed.inject(lumberjackDriverToken) as unknown as LumberjackDriver[];

  return httpDriver;
};

const fakeTime = createFakeTime();

describe(provideLumberjackAngularHttpDriver.name, () => {
  it('provides the HTTP driver', () => {
    const httpDriver = createHttpDriver();

    expect(httpDriver).toBeInstanceOf(LumberjackAngularHttpDriver);
  });

  describe(withHttpConfig.name, () => {
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
        isLumberjackModuleProvidedFirst: false,
      });

      const actualConfig = httpDriver.config;
      expect(actualConfig).toEqual(expectedConfig as LumberjackAngularHttpDriverInternalConfig);
    });

    it('registers the specified driver configuration WITH HttpClient features', () => {
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
        isLumberjackModuleProvidedFirst: false,
      });

      const actualConfig = httpDriver.config;
      const expectedConfig: LumberjackAngularHttpDriverInternalConfig = {
        ...options,
        levels: [LumberjackLevel.Verbose],
        identifier: LumberjackAngularHttpDriver.driverIdentifier,
      };
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('does register the specified driver options WITH HttpClient features', () => {
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
