import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { expectNgModuleToBeGuarded, resolveDependency } from '@internal/test-util';
import {
  LumberjackConfigLevels,
  LumberjackLevel,
  lumberjackLogConfigToken,
  LumberjackLogDriver,
  LumberjackLogDriverConfig,
  lumberjackLogDriverToken,
  LumberjackModule,
} from '@ngworker/lumberjack';

import { HttpDriver } from '../log-drivers/http.driver';

import { HttpDriverConfig } from './http-driver.config';
import { HttpDriverModule } from './http-driver.module';
import { HttpDriverOptions } from './http-driver.options';

function createHttpOptions(): HttpDriverOptions {
  return {
    storeUrl: 'api/logstore',
    origin: 'TEST_MODULE',
    retryOptions: { maxRetries: 5, delayMs: 250 },
  };
}

function createHttpConfig(levels: LumberjackConfigLevels): HttpDriverConfig {
  return {
    levels,
    storeUrl: 'api/logstore',
    origin: 'TEST_MODULE',
    retryOptions: { maxRetries: 5, delayMs: 250 },
  };
}

const createHttpDriver = (
  {
    config,
    isLumberjackModuleImportedFirst = true,
  }: {
    config: HttpDriverConfig;
    isLumberjackModuleImportedFirst?: boolean;
  } = {
    config: createHttpConfig([LumberjackLevel.Verbose]),
  }
) => {
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      isLumberjackModuleImportedFirst ? LumberjackModule.forRoot() : [],
      HttpDriverModule.forRoot(config),
      isLumberjackModuleImportedFirst ? [] : LumberjackModule.forRoot(),
    ],
  });

  const [httpDriver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];

  return httpDriver;
};
const createHttpDriverWithOptions = (
  {
    isLumberjackModuleImportedFirst = true,
    options,
  }: {
    isLumberjackModuleImportedFirst?: boolean;
    options: HttpDriverOptions;
  } = { options: createHttpOptions() }
) => {
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      isLumberjackModuleImportedFirst ? LumberjackModule.forRoot() : [],
      HttpDriverModule.withOptions(options),
      isLumberjackModuleImportedFirst ? [] : LumberjackModule.forRoot(),
    ],
  });

  const [httpDriver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];

  return httpDriver;
};

describe(HttpDriverModule.name, () => {
  it(`cannot be imported without using the ${HttpDriverModule.forRoot.name} method`, () => {
    expectNgModuleToBeGuarded(HttpDriverModule);
  });

  describe(HttpDriverModule.forRoot.name, () => {
    it('provides the HTTP driver', () => {
      const httpDriver = createHttpDriver();

      expect(httpDriver).toBeInstanceOf(HttpDriver);
    });

    it('registers the specified log driver configuration', () => {
      const expectedConfig = createHttpConfig([LumberjackLevel.Error]);

      const httpDriver = createHttpDriver({ config: expectedConfig });

      const actualConfig = httpDriver.config;
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('registers a default level configuration if none is specified', () => {
      const customHttpConfig = createHttpConfig([LumberjackLevel.Verbose]);

      const httpDriver = createHttpDriver({ config: customHttpConfig });

      const actualConfig = httpDriver.config;
      const logConfig = resolveDependency(lumberjackLogConfigToken);
      const defaultLogDriverConfig: LumberjackLogDriverConfig = {
        levels: logConfig.levels,
      };
      const expectedConfig: HttpDriverConfig = { ...defaultLogDriverConfig, ...customHttpConfig };
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('does register the specified log driver configuration when the lumberjack module is imported after the http driver module', () => {
      const expectedConfig = createHttpConfig([LumberjackLevel.Debug]);

      const httpDriver = createHttpDriver({
        config: expectedConfig,
        isLumberjackModuleImportedFirst: false,
      });

      const actualConfig = httpDriver.config;
      expect(actualConfig).toEqual(expectedConfig);
    });
  });

  describe(HttpDriverModule.withOptions.name, () => {
    it('provides the HTTP driver', () => {
      const httpDriver = createHttpDriverWithOptions();

      expect(httpDriver).toBeInstanceOf(HttpDriver);
    });

    it('registers the specified options', () => {
      const options = createHttpOptions();

      const httpDriver = createHttpDriverWithOptions({ options });

      const actualConfig = httpDriver.config;
      const expectedConfig: HttpDriverConfig = {
        ...options,
        // tslint:disable-next-line: no-any
        levels: jasmine.any(Array) as any,
      };
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('gets common options from the log driver config', () => {
      const options = createHttpOptions();

      const httpDriver = createHttpDriverWithOptions({ options });

      const { levels } = httpDriver.config;
      expect(levels).toEqual([LumberjackLevel.Verbose]);
    });

    it('does register the specified log driver configuration when the lumberjack module is imported after the http driver module', () => {
      const options = createHttpOptions();

      const httpDriver = createHttpDriverWithOptions({
        options,
        isLumberjackModuleImportedFirst: false,
      });

      const actualConfig = httpDriver.config;
      const expectedConfig: HttpDriverConfig = {
        ...options,
        // tslint:disable-next-line: no-any
        levels: jasmine.any(Array) as any,
      };
      expect(actualConfig).toEqual(expectedConfig);
    });
  });
});
