import { TestBed } from '@angular/core/testing';

import { expectNgModuleToBeGuardedAgainstDirectImport } from '@internal/angular/test-util';
import {
  defaultDevelopmentLevels,
  defaultProductionLevels,
  LumberjackConfig,
  lumberjackFormatLog,
  LumberjackLevel,
  LumberjackLog,
  LumberjackLogDriverConfig,
  LumberjackOptions,
  utcTimestampFor,
} from '@webworker/lumberjack';

import { isProductionEnvironmentToken } from '../environment/is-production-environment.token';

import { lumberjackConfigToken } from './lumberjack-config.token';
import { lumberjackLogDriverConfigToken } from './lumberjack-log-driver-config.token';
import { LumberjackModule } from './lumberjack.module';

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

      const actualConfig = TestBed.inject(lumberjackConfigToken);
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

      const actualConfig = TestBed.inject(lumberjackConfigToken);
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

      const actualConfig = TestBed.inject(lumberjackConfigToken);
      expect(actualConfig).toEqual(expectedConfig as LumberjackConfig);
    });

    it('provides a default Lumberjack configuration in development mode', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
        providers: [{ provide: isProductionEnvironmentToken, useValue: false }],
      });

      const actualConfig = TestBed.inject(lumberjackConfigToken);
      expect(actualConfig).toEqual({
        levels: defaultDevelopmentLevels,
        format: expect.any(Function),
      });
    });

    it('provides a default Lumberjack configuration in production mode', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
        providers: [{ provide: isProductionEnvironmentToken, useValue: true }],
      });

      const actualConfig = TestBed.inject(lumberjackConfigToken);
      expect(actualConfig).toEqual({
        format: lumberjackFormatLog,
        levels: defaultProductionLevels,
      });
    });

    it('provides a default log driver configuration', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
      });
      const logConfig = TestBed.inject(lumberjackConfigToken);
      const defaultLogDriverConfig: Omit<LumberjackLogDriverConfig, 'identifier'> = {
        levels: logConfig.levels,
      };

      const actualConfig = TestBed.inject(lumberjackLogDriverConfigToken);
      expect(actualConfig).toEqual(defaultLogDriverConfig as LumberjackLogDriverConfig);
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
        const logWithScope: LumberjackLog = {
          scope: 'TestSuite',
          createdAt: fakeTicks,
          level: LumberjackLevel.Critical,
          message: 'Test Message',
        };

        const { scope, level, message } = logWithScope;

        const expectedFormattedLog = `${level} ${fakeTimestamp} [${scope}] ${message}`;

        const { format } = TestBed.inject(lumberjackConfigToken);

        expect(format(logWithScope)).toBe(expectedFormattedLog);
      });

      it('formats a log with no scope', () => {
        const logWithoutScope: LumberjackLog = {
          createdAt: fakeTicks,
          level: LumberjackLevel.Critical,
          message: 'Test Message',
        };

        const { level, message } = logWithoutScope;

        const expectedFormattedLog = `${level} ${fakeTimestamp} ${message}`;

        const { format } = TestBed.inject(lumberjackConfigToken);

        expect(format(logWithoutScope)).toEqual(expectedFormattedLog);
      });
    });
  });
});
