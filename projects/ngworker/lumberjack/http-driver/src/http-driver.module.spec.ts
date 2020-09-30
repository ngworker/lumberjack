import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import {
  defaultLogDriverConfig,
  LogDriver,
  LogDriverToken,
  LumberjackLogLevel,
  LumberjackModule,
} from '@ngworker/lumberjack';

import { expectNgModuleToBeGuarded } from '../../tests/expect-ng-module-to-be-guarded';

import { HttpDriverConfig } from './http-driver.config';
import { HttpDriverModule } from './http-driver.module';
import { HttpDriver } from './http.driver';

const createHttpDriver = (
  {
    config,
    isLumberjackModuleImportedFirst = true,
  }: {
    config: HttpDriverConfig;
    isLumberjackModuleImportedFirst?: boolean;
  } = { config: { storeUrl: 'api/json', logWagonSize: 1, origin: 'TEST_MODULE' } }
) => {
  TestBed.configureTestingModule({
    imports: [
      isLumberjackModuleImportedFirst ? LumberjackModule.forRoot() : [],
      HttpDriverModule.forRoot(config),
      isLumberjackModuleImportedFirst ? [] : LumberjackModule.forRoot(),
    ],
  });

  const [httpDriver] = (TestBed.inject(LogDriverToken) as unknown) as LogDriver[];

  return httpDriver;
};

describe(HttpDriverModule.name, () => {
  it(`cannot be imported without using the ${HttpDriverModule.forRoot.name} method`, () => {
    expectNgModuleToBeGuarded(HttpDriverModule);
  });

  describe(HttpDriverModule.forRoot.name, () => {
    it('provides the http driver', () => {
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
});
