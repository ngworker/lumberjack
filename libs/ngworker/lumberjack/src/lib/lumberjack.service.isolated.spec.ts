import { StaticProvider } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NoopDriver, NoopDriverModule, resolveDependency, SpyDriver, SpyDriverModule } from '@internal/test-util';

import { ConsoleDriverModule } from '../../console-driver/src/console-driver.module';

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
  levels: [LumberjackLogLevel.Debug, LumberjackLogLevel.Error, LumberjackLogLevel.Info, LumberjackLogLevel.Warning],
};
const allLogsProvider: StaticProvider = {
  provide: LogDriverConfigToken,
  useValue: allLogsConfig,
};
const verboseLoggingConfig: LogDriverConfig = {
  levels: [LumberjackLogLevel.Verbose],
};
const verboseLoggingProvider: StaticProvider = {
  provide: LogDriverConfigToken,
  useValue: verboseLoggingConfig,
};
const logCreators = {
  debug: createDebugLog(''),
  error: createErrorLog(''),
  info: createInfoLog(''),
  warning: createWarningLog(''),
};
const logEmptyDebugMessage = () => resolveDependency(LumberjackService).log(logCreators.debug());

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
          SpyDriverModule.forRoot(),
        ],
      });

      lumberjack = resolveDependency(LumberjackService);

      const [logDriver] = (resolveDependency(LogDriverToken) as unknown) as LogDriver[];
      spyDriver = logDriver as SpyDriver;
    });

    let lumberjack: LumberjackService;
    let spyDriver: SpyDriver;

    it('logs a debug message to a log driver', () => {
      lumberjack.log(logCreators.debug());

      expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
      expect(spyDriver.logDebug).toHaveBeenCalledWith(LumberjackLogLevel.Debug);
    });

    it('logs an error message to a log driver', () => {
      lumberjack.log(logCreators.error());

      expect(spyDriver.logError).toHaveBeenCalledTimes(1);
      expect(spyDriver.logError).toHaveBeenCalledWith(LumberjackLogLevel.Error);
    });

    it('logs an info message to a log driver', () => {
      lumberjack.log(logCreators.info());

      expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
      expect(spyDriver.logInfo).toHaveBeenCalledWith(LumberjackLogLevel.Info);
    });

    it('logs a warning to a log driver', () => {
      lumberjack.log(logCreators.warning());

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

  describe('Verbose logging', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          LumberjackModule.forRoot({
            format: ({ level }) => level,
          }),
          SpyDriverModule.forRoot(),
        ],
        providers: [verboseLoggingProvider],
      });

      lumberjack = resolveDependency(LumberjackService);

      const [logDriver] = (resolveDependency(LogDriverToken) as unknown) as LogDriver[];
      spyDriver = logDriver as SpyDriver;
    });

    let lumberjack: LumberjackService;
    let spyDriver: SpyDriver;

    describe('when a log driver is registered', () => {
      it('debug entries are logged', () => {
        lumberjack.log(logCreators.debug());

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(LumberjackLogLevel.Debug);
      });

      it('errors are logged', () => {
        lumberjack.log(logCreators.error());

        expect(spyDriver.logError).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).toHaveBeenCalledWith(LumberjackLogLevel.Error);
      });

      it('info is logged', () => {
        lumberjack.log(logCreators.info());

        expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
        expect(spyDriver.logInfo).toHaveBeenCalledWith(LumberjackLogLevel.Info);
      });

      it('warnings are logged', () => {
        lumberjack.log(logCreators.warning());

        expect(spyDriver.logWarning).toHaveBeenCalledTimes(1);
        expect(spyDriver.logWarning).toHaveBeenCalledWith(LumberjackLogLevel.Warning);
      });
    });
  });

  describe('Multiple log drivers', () => {
    describe('when drivers have different log levels', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            LumberjackModule.forRoot({
              format: ({ level }) => level,
            }),
            SpyDriverModule.forRoot({
              levels: [LumberjackLogLevel.Debug, LumberjackLogLevel.Info],
            }),
            NoopDriverModule.forRoot({
              levels: [LumberjackLogLevel.Error, LumberjackLogLevel.Warning],
            }),
          ],
          providers: [verboseLoggingProvider],
        });

        lumberjack = resolveDependency(LumberjackService);

        const [_spyDriver, _noopDriver] = (resolveDependency(LogDriverToken) as unknown) as LogDriver[];
        spyDriver = _spyDriver as SpyDriver;
        noopDriver = _noopDriver as jasmine.SpyObj<NoopDriver>;
        spyOn(noopDriver, 'logDebug');
        spyOn(noopDriver, 'logError');
        spyOn(noopDriver, 'logInfo');
        spyOn(noopDriver, 'logWarning');
      });

      beforeEach(() => {
        lumberjack.log(logCreators.debug());
        lumberjack.log(logCreators.info());
        lumberjack.log(logCreators.error());
        lumberjack.log(logCreators.warning());
      });

      let lumberjack: LumberjackService;
      let noopDriver: jasmine.SpyObj<NoopDriver>;
      let spyDriver: SpyDriver;

      it('then logs of configured levels are passed to each of them', () => {
        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(LumberjackLogLevel.Debug);
        expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
        expect(spyDriver.logInfo).toHaveBeenCalledWith(LumberjackLogLevel.Info);

        expect(noopDriver.logError).toHaveBeenCalledTimes(1);
        expect(noopDriver.logError).toHaveBeenCalledWith(LumberjackLogLevel.Error);
        expect(noopDriver.logWarning).toHaveBeenCalledTimes(1);
        expect(noopDriver.logWarning).toHaveBeenCalledWith(LumberjackLogLevel.Warning);
      });

      xit('then logs of other levels are not passed to either of them', () => {
        expect(spyDriver.logError).not.toHaveBeenCalled();
        expect(spyDriver.logWarning).not.toHaveBeenCalled();

        expect(noopDriver.logDebug).not.toHaveBeenCalled();
        expect(noopDriver.logInfo).not.toHaveBeenCalled();
      });
    });
  });
});
