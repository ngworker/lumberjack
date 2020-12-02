import { TestBed } from '@angular/core/testing';

import { expectNgModuleToBeGuarded, resolveDependency } from '@internal/test-util';

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
    expectNgModuleToBeGuarded(LumberjackModule);
  });

  describe(LumberjackModule.forRoot.name, () => {
    it('accepts a log configuration', () => {
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

    it('accepts a partial log configuration in development mode', () => {
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

    it('accepts a partial log configuration in production mode', () => {
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

    it('provides a default log configuration in development mode', () => {
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

    it('provides a default log configuration in production mode', () => {
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

    describe('default format function', () => {
      const fakeTicks = Date.now();
      let fakeTimestamp: string;
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [LumberjackModule.forRoot()],
        });
        const time = resolveDependency(LumberjackTimeService);
        fakeTimestamp = utcTimestampFor(fakeTicks);
      });

      it('formats a log entry with a context', () => {
        const entryLogWithContext: LumberjackLog = {
          context: 'TestSuite',
          createdAt: fakeTicks,
          level: LumberjackLevel.Critical,
          message: 'Test Message',
        };

        const { context, level, message } = entryLogWithContext;

        const expectedMessageWithContext = `${level} ${fakeTimestamp} [${context}] ${message}`;

        const { format } = resolveDependency(lumberjackConfigToken);

        expect(format(entryLogWithContext)).toEqual(expectedMessageWithContext);
      });

      it('formats a log entry with no context', () => {
        const entryLogWithOutContext: LumberjackLog = {
          createdAt: fakeTicks,
          level: LumberjackLevel.Critical,
          message: 'Test Message',
        };

        const { level, message } = entryLogWithOutContext;

        const expectedMessageWithContext = `${level} ${fakeTimestamp} ${message}`;

        const { format } = resolveDependency(lumberjackConfigToken);

        expect(format(entryLogWithOutContext)).toEqual(expectedMessageWithContext);
      });
    });
  });
});
