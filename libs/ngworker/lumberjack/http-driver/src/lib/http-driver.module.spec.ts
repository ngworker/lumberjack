import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { expectNgModuleToBeGuarded, resolveDependency } from '@internal/test-util';
import {
  defaultLogDriverConfig,
  LogDriver,
  LogDriverToken,
  LumberjackLogLevel,
  LumberjackModule,
} from '@ngworker/lumberjack';

import { HttpDriverConfig } from './http-driver-config.token';
import { HttpDriverOptions } from './http-driver-options';
import { HttpDriverModule } from './http-driver.module';
import { HttpDriver } from './http.driver';

const createHttpDriver = (
  {
    config,
    isLumberjackModuleImportedFirst = true,
  }: {
    config: HttpDriverConfig;
    isLumberjackModuleImportedFirst?: boolean;
  } = { config: { levels: [LumberjackLogLevel.Verbose], storeUrl: 'api/json', logWagonSize: 1, origin: 'TEST_MODULE' } }
) => {
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      isLumberjackModuleImportedFirst ? LumberjackModule.forRoot() : [],
      HttpDriverModule.forRoot(config),
      isLumberjackModuleImportedFirst ? [] : LumberjackModule.forRoot(),
    ],
  });

  const [httpDriver] = (resolveDependency(LogDriverToken) as unknown) as LogDriver[];

  return httpDriver;
};
const createHttpDriverWithOptions = (
  {
    isLumberjackModuleImportedFirst = true,
    options,
  }: {
    isLumberjackModuleImportedFirst?: boolean;
    options: HttpDriverOptions;
  } = { options: { storeUrl: 'api/json', logWagonSize: 1, origin: 'TEST_MODULE' } }
) => {
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      isLumberjackModuleImportedFirst ? LumberjackModule.forRoot() : [],
      HttpDriverModule.withOptions(options),
      isLumberjackModuleImportedFirst ? [] : LumberjackModule.forRoot(),
    ],
  });

  const [httpDriver] = (resolveDependency(LogDriverToken) as unknown) as LogDriver[];

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
      const expectedConfig: HttpDriverConfig = {
        levels: [LumberjackLogLevel.Error],
        storeUrl: 'api/logstore',
        origin: 'TEST_MODULE',
        logWagonSize: 5,
      };

      const httpDriver = createHttpDriver({ config: expectedConfig });

      const actualConfig = httpDriver.config;
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('registers a default level configuration if none is specified', () => {
      const customHttpConfig: HttpDriverConfig = {
        levels: [LumberjackLogLevel.Verbose],
        storeUrl: 'api/logstore',
        origin: 'TEST_MODULE',
        logWagonSize: 5,
      };
      const expectedConfig: HttpDriverConfig = { ...defaultLogDriverConfig, ...customHttpConfig };

      const httpDriver = createHttpDriver({ config: customHttpConfig });

      const actualConfig = httpDriver.config;
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('does register the specified log driver configuration when the lumberjack module is imported after the http driver module', () => {
      const expectedConfig: HttpDriverConfig = {
        levels: [LumberjackLogLevel.Debug],
        storeUrl: 'api/logstore',
        origin: 'TEST_MODULE',
        logWagonSize: 5,
      };

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
      const options: HttpDriverOptions = {
        storeUrl: 'api/logstore',
        origin: 'TEST_MODULE',
        logWagonSize: 5,
      };

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
      const options: HttpDriverOptions = {
        storeUrl: 'api/logstore',
        origin: 'TEST_MODULE',
        logWagonSize: 5,
      };

      const httpDriver = createHttpDriverWithOptions({ options });

      const { levels } = httpDriver.config;
      expect(levels).toEqual([LumberjackLogLevel.Verbose]);
    });

    it('does register the specified log driver configuration when the lumberjack module is imported after the http driver module', () => {
      const options: HttpDriverOptions = {
        storeUrl: 'api/logstore',
        origin: 'TEST_MODULE',
        logWagonSize: 5,
      };

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
