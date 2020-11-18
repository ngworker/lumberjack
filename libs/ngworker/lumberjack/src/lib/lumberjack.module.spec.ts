import { TestBed } from '@angular/core/testing';

import { expectNgModuleToBeGuarded, resolveDependency } from '@internal/test-util';

import { LogDriverConfig, logDriverConfigToken, LumberjackLogConfig, lumberjackLogConfigToken } from './configs';
import { defaultDevelopmentLevels } from './configs/default-development-levels';
import { defaultProductionLevels } from './configs/default-production-levels';
import { LumberjackLogOptions } from './configs/lumberjack-log.options';
import { isProductionEnvironmentToken } from './environment/is-production-environment.token';
import { LumberjackLog } from './lumberjack-log';
import { LumberjackLogLevel } from './lumberjack-log-levels';
import { LumberjackModule } from './lumberjack.module';
import { LumberjackTimeService } from './time/lumberjack-time.service';

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

      const actualConfig = resolveDependency(lumberjackLogConfigToken);
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

      const actualConfig = resolveDependency(lumberjackLogConfigToken);
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

      const actualConfig = resolveDependency(lumberjackLogConfigToken);
      expect(actualConfig).toEqual(expectedConfig as LumberjackLogConfig);
    });

    it('provides a default log configuration in development mode', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
        providers: [{ provide: isProductionEnvironmentToken, useValue: false }],
      });

      const actualConfig = resolveDependency(lumberjackLogConfigToken);
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

      const actualConfig = resolveDependency(lumberjackLogConfigToken);
      expect(actualConfig).toEqual({
        format: jasmine.any(Function),
        levels: defaultProductionLevels,
      });
    });

    it('provides a default log driver configuration', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
      });
      const logConfig = resolveDependency(lumberjackLogConfigToken);
      const defaultLogDriverConfig: LogDriverConfig = {
        levels: logConfig.levels,
      };

      const actualConfig = resolveDependency(logDriverConfigToken);
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
        fakeTimestamp = time.utcTimestampFor(fakeTicks);
      });

      it('formats a log entry with a context', () => {
        const entryLogWithContext: LumberjackLog = {
          context: 'TestSuite',
          createdAt: fakeTicks,
          level: LumberjackLogLevel.Critical,
          message: 'Test Message',
        };

        const { context, level, message } = entryLogWithContext;

        const expectedMessageWithContext = `${level} ${fakeTimestamp} [${context}] ${message}`;

        const { format } = resolveDependency(lumberjackLogConfigToken);

        expect(format(entryLogWithContext)).toEqual(expectedMessageWithContext);
      });

      it('formats a log entry with no context', () => {
        const entryLogWithOutContext: LumberjackLog = {
          createdAt: fakeTicks,
          level: LumberjackLogLevel.Critical,
          message: 'Test Message',
        };

        const { level, message } = entryLogWithOutContext;

        const expectedMessageWithContext = `${level} ${fakeTimestamp} ${message}`;

        const { format } = resolveDependency(lumberjackLogConfigToken);

        expect(format(entryLogWithOutContext)).toEqual(expectedMessageWithContext);
      });
    });
  });
});
