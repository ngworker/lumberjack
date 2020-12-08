import { TestBed } from '@angular/core/testing';

import { expectNgModuleToBeGuardedAgainstDirectImport, resolveDependency } from '@internal/test-util';

import { isProductionEnvironmentToken } from '../environment/is-production-environment.token';
import { utcTimestampFor } from '../formatting/utc-timestamp-for';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { defaultDevelopmentLevels } from './default-development-levels';
import { defaultProductionLevels } from './default-production-levels';
import { lumberjackConfigToken } from './lumberjack-config.token';
import { lumberjackLogDriverConfigToken } from './lumberjack-log-driver-config.token';
import { LumberjackLogDriverConfig } from './lumberjack-log-driver.config';
import { LumberjackConfig } from './lumberjack.config';
import { LumberjackModule } from './lumberjack.module';
import { LumberjackOptions } from './lumberjack.options';

describe(LumberjackModule.name, () => {
  it(`cannot be imported without using the ${LumberjackModule.forRoot.name} method`, () => {
    expectNgModuleToBeGuardedAgainstDirectImport(LumberjackModule);
  });

  describe(LumberjackModule.forRoot.name, () => {
    it('accepts a Lumberjack configuration', () => {
      const expectedConfig: LumberjackConfig = {
        format: ({ message }) => message,
        levels: [LumberjackLevel.Debug],
      };

      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(expectedConfig)],
      });

      const actualConfig = resolveDependency(lumberjackConfigToken);
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('accepts Lumberjack options in development mode', () => {
      const config: LumberjackOptions = {
        format: ({ message }) => message,
      };
      const expectedConfig: LumberjackOptions = {
        ...config,
        levels: defaultDevelopmentLevels,
      };

      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(config)],
        providers: [{ provide: isProductionEnvironmentToken, useValue: false }],
      });

      const actualConfig = resolveDependency(lumberjackConfigToken);
      expect(actualConfig).toEqual(expectedConfig as LumberjackConfig);
    });

    it('accepts Lumberjack options in production mode', () => {
      const config: LumberjackOptions = {
        format: ({ message }) => message,
      };
      const expectedConfig: LumberjackOptions = {
        ...config,
        levels: defaultProductionLevels,
      };

      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(config)],
        providers: [{ provide: isProductionEnvironmentToken, useValue: true }],
      });

      const actualConfig = resolveDependency(lumberjackConfigToken);
      expect(actualConfig).toEqual(expectedConfig as LumberjackConfig);
    });

    it('provides a default Lumberjack configuration in development mode', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
        providers: [{ provide: isProductionEnvironmentToken, useValue: false }],
      });

      const actualConfig = resolveDependency(lumberjackConfigToken);
      expect(actualConfig).toEqual({
        format: jasmine.any(Function),
        levels: defaultDevelopmentLevels,
      });
    });

    it('provides a default Lumberjack configuration in production mode', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
        providers: [{ provide: isProductionEnvironmentToken, useValue: true }],
      });

      const actualConfig = resolveDependency(lumberjackConfigToken);
      expect(actualConfig).toEqual({
        format: jasmine.any(Function),
        levels: defaultProductionLevels,
      });
    });

    it('provides a default log driver configuration', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
      });
      const logConfig = resolveDependency(lumberjackConfigToken);
      const defaultLogDriverConfig: LumberjackLogDriverConfig = {
        levels: logConfig.levels,
      };

      const actualConfig = resolveDependency(lumberjackLogDriverConfigToken);
      expect(actualConfig).toEqual(defaultLogDriverConfig);
    });

    describe('Default format function', () => {
      const fakeTicks = Date.now();
      let fakeTimestamp: string;
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [LumberjackModule.forRoot()],
        });
        fakeTimestamp = utcTimestampFor(fakeTicks);
      });

      it('formats a log with a scope', () => {
        const logWithContext: LumberjackLog = {
          scope: 'TestSuite',
          createdAt: fakeTicks,
          level: LumberjackLevel.Critical,
          message: 'Test Message',
        };

        const { scope, level, message } = logWithContext;

        const expectedFormattedLog = `${level} ${fakeTimestamp} [${scope}] ${message}`;

        const { format } = resolveDependency(lumberjackConfigToken);

        expect(format(logWithContext)).toBe(expectedFormattedLog);
      });

      it('formats a log with no scope', () => {
        const logWithoutContext: LumberjackLog = {
          createdAt: fakeTicks,
          level: LumberjackLevel.Critical,
          message: 'Test Message',
        };

        const { level, message } = logWithoutContext;

        const expectedFormattedLog = `${level} ${fakeTimestamp} ${message}`;

        const { format } = resolveDependency(lumberjackConfigToken);

        expect(format(logWithoutContext)).toEqual(expectedFormattedLog);
      });
    });
  });
});
