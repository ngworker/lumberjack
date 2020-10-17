import { StaticProvider } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ConsoleDriverModule } from '../../console-driver/src/console-driver.module';
import { NoopDriverModule, resolveDependency } from '../../tests';

import { LogDriverConfig, LogDriverConfigToken } from './configs';
import { LogDriver, LogDriverToken } from './log-drivers';
import { createDebugLog, createErrorLog, createInfoLog, createWarningLog } from './log-types';
import { LumberjackLogLevel } from './lumberjack-log-levels';
import { LumberjackModule } from './lumberjack.module';
import { LumberjackService } from './lumberjack.service';

const noLogsConfig: LogDriverConfig = {
  levels: [],
};
const noLogsProvider: StaticProvider = {
  provide: LogDriverConfigToken,
  useValue: noLogsConfig,
};
const allLogsConfig: LogDriverConfig = {
  levels: [
    LumberjackLogLevel.Debug,
    LumberjackLogLevel.Error,
    LumberjackLogLevel.Info,
    LumberjackLogLevel.Verbose,
    LumberjackLogLevel.Warning,
  ],
};
const allLogsProvider: StaticProvider = {
  provide: LogDriverConfigToken,
  useValue: allLogsConfig,
};
const createEmptyDebugLog = createDebugLog('');
const logEmptyDebugMessage = () => resolveDependency(LumberjackService).log(createEmptyDebugLog());

describe(LumberjackService.name, () => {
  describe('Log drivers', () => {
    it('accepts logs when no log drivers are registered', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });

    it('accepts logs when a single log driver is registered', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(), NoopDriverModule.forRoot()],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });

    it('accepts logs when multiple log drivers are registered', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(), NoopDriverModule.forRoot(), ConsoleDriverModule.forRoot()],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });
  });

  describe('Log types', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          LumberjackModule.forRoot({
            format: ({ level }) => level,
          }),
          NoopDriverModule.forRoot(),
        ],
      });

      lumberjack = resolveDependency(LumberjackService);

      const [logDriver] = (resolveDependency(LogDriverToken) as unknown) as LogDriver[];
      spyOn(logDriver, 'logDebug');
      spyOn(logDriver, 'logError');
      spyOn(logDriver, 'logInfo');
      spyOn(logDriver, 'logWarning');
      spyDriver = logDriver as jasmine.SpyObj<LogDriver>;
    });

    let lumberjack: LumberjackService;
    let spyDriver: jasmine.SpyObj<LogDriver>;

    it('logs a debug message to a log driver', () => {
      lumberjack.log(createDebugLog('')());

      expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
      expect(spyDriver.logDebug).toHaveBeenCalledWith(LumberjackLogLevel.Debug);
    });

    it('logs an error message to a log driver', () => {
      lumberjack.log(createErrorLog('')());

      expect(spyDriver.logError).toHaveBeenCalledTimes(1);
      expect(spyDriver.logError).toHaveBeenCalledWith(LumberjackLogLevel.Error);
    });

    it('logs an info message to a log driver', () => {
      lumberjack.log(createInfoLog('')());

      expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
      expect(spyDriver.logInfo).toHaveBeenCalledWith(LumberjackLogLevel.Info);
    });

    it('logs a warning to a log driver', () => {
      lumberjack.log(createWarningLog('')());

      expect(spyDriver.logWarning).toHaveBeenCalledTimes(1);
      expect(spyDriver.logWarning).toHaveBeenCalledWith(LumberjackLogLevel.Warning);
    });
  });

  describe('Log levels', () => {
    it('accepts logs when no log levels are enabled', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
        providers: [noLogsProvider],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });

    it('accepts logs when all log levels are enabled', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
        providers: [allLogsProvider],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });

    it('accepts logs when all log levels are enabled and a log driver is registered', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(), NoopDriverModule.forRoot()],
        providers: [allLogsProvider],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });
  });
});
