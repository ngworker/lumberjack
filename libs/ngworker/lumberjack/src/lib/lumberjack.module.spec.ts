import { TestBed } from '@angular/core/testing';

import { expectNgModuleToBeGuarded, resolveDependency } from '@internal/test-util';

import { LogDriverConfig, LogDriverConfigToken, LumberjackLogConfig, LumberjackLogConfigToken } from './configs';
import {
  defaultDevelopmentLevels,
  defaultProductionLevels,
  LumberjackLogOptions,
} from './configs/lumberjack-log.config';
import { isProductionEnvironmentToken } from './environment/is-production-environment.token';
import { LumberjackLogLevel } from './lumberjack-log-levels';
import { LumberjackModule } from './lumberjack.module';

describe(LumberjackModule.name, () => {
  it(`cannot be imported without using the ${LumberjackModule.forRoot.name} method`, () => {
    expectNgModuleToBeGuarded(LumberjackModule);
  });

  describe(LumberjackModule.forRoot.name, () => {
    it('accepts a log configuration', () => {
      const expectedConfig: LumberjackLogConfig = {
        format: ({ message }) => message,
        levels: [LumberjackLogLevel.Debug],
      };

      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(expectedConfig)],
      });

      const actualConfig = resolveDependency(LumberjackLogConfigToken);
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('accepts a partial log configuration in development mode', () => {
      const config: LumberjackLogOptions = {
        format: ({ message }) => message,
      };
      const expectedConfig: LumberjackLogOptions = {
        ...config,
        levels: defaultDevelopmentLevels,
      };

      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(config)],
        providers: [{ provide: isProductionEnvironmentToken, useValue: false }],
      });

      const actualConfig = resolveDependency(LumberjackLogConfigToken);
      expect(actualConfig).toEqual(expectedConfig as LumberjackLogConfig);
    });

    it('accepts a partial log configuration in production mode', () => {
      const config: LumberjackLogOptions = {
        format: ({ message }) => message,
      };
      const expectedConfig: LumberjackLogOptions = {
        ...config,
        levels: defaultProductionLevels,
      };

      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(config)],
        providers: [{ provide: isProductionEnvironmentToken, useValue: true }],
      });

      const actualConfig = resolveDependency(LumberjackLogConfigToken);
      expect(actualConfig).toEqual(expectedConfig as LumberjackLogConfig);
    });

    it('provides a default log configuration in development mode', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
        providers: [{ provide: isProductionEnvironmentToken, useValue: false }],
      });

      const actualConfig = resolveDependency(LumberjackLogConfigToken);
      expect(actualConfig).toEqual({
        format: jasmine.any(Function),
        levels: defaultDevelopmentLevels,
      });
    });

    it('provides a default log configuration in production mode', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
        providers: [{ provide: isProductionEnvironmentToken, useValue: true }],
      });

      const actualConfig = resolveDependency(LumberjackLogConfigToken);
      expect(actualConfig).toEqual({
        format: jasmine.any(Function),
        levels: defaultProductionLevels,
      });
    });

    it('provides a default log driver configuration', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
      });
      const logConfig = resolveDependency(LumberjackLogConfigToken);
      const defaultLogDriverConfig: LogDriverConfig = {
        levels: logConfig.levels,
      };

      const actualConfig = resolveDependency(LogDriverConfigToken);
      expect(actualConfig).toEqual(defaultLogDriverConfig);
    });
  });
});
