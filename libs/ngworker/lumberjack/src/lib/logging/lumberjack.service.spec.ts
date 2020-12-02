import { StaticProvider } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NoopConsoleModule } from '@internal/console-driver/test-util';
import {
  createCriticalLog,
  createDebugLog,
  createErrorLog,
  createInfoLog,
  createTraceLog,
  createWarningLog,
  ErrorThrowingDriver,
  ErrorThrowingDriverModule,
  NoopDriver,
  NoopDriverModule,
  resolveDependency,
  SpyDriver,
  SpyDriverModule,
} from '@internal/test-util';
import { ConsoleDriverModule } from '@ngworker/lumberjack/console-driver';

import { lumberjackLogDriverConfigToken } from '../configuration/lumberjack-log-driver-config.token';
import { LumberjackLogDriverConfig } from '../configuration/lumberjack-log-driver.config';
import { LumberjackModule } from '../configuration/lumberjack.module';
import { LumberjackLogDriver } from '../log-drivers/lumberjack-log-driver';
import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';
import { LumberjackLevel } from '../logs/lumberjack-level';

import { LumberjackService } from './lumberjack.service';

const noLogsConfig: LumberjackLogDriverConfig = {
  levels: [],
};
const noLogsProvider: StaticProvider = {
  provide: lumberjackLogDriverConfigToken,
  useValue: noLogsConfig,
};
const allLogsConfig: LumberjackLogDriverConfig = {
  levels: [
    LumberjackLevel.Critical,
    LumberjackLevel.Debug,
    LumberjackLevel.Error,
    LumberjackLevel.Info,
    LumberjackLevel.Trace,
    LumberjackLevel.Warning,
  ],
};
const allLogsProvider: StaticProvider = {
  provide: lumberjackLogDriverConfigToken,
  useValue: allLogsConfig,
};
const verboseLoggingConfig: LumberjackLogDriverConfig = {
  levels: [LumberjackLevel.Verbose],
};
const verboseLoggingProvider: StaticProvider = {
  provide: lumberjackLogDriverConfigToken,
  useValue: verboseLoggingConfig,
};

const logDebugMessage = () => resolveDependency(LumberjackService).log(createDebugLog());

describe(LumberjackService.name, () => {
  describe('Log drivers', () => {
    it('accepts logs when no log drivers are registered', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
      });

      expect(logDebugMessage).not.toThrow();
    });

    it('accepts logs when a single log driver is registered', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(), NoopDriverModule.forRoot()],
      });

      expect(logDebugMessage).not.toThrow();
    });

    it('accepts logs when multiple log drivers are registered', () => {
      TestBed.configureTestingModule({
        imports: [
          LumberjackModule.forRoot(),
          NoopDriverModule.forRoot(),
          ConsoleDriverModule.forRoot(),
          NoopConsoleModule,
        ],
      });

      expect(logDebugMessage).not.toThrow();
    });

    describe('Error-throwing log drivers', () => {
      beforeEach(() => {
        consoleErrorSpy = spyOn(console, 'error');
      });

      let consoleErrorSpy: jasmine.Spy;

      it('outputs an error when a single log driver is registered', () => {
        TestBed.configureTestingModule({
          imports: [LumberjackModule.forRoot(), ErrorThrowingDriverModule.forRoot()],
        });

        expect(logDebugMessage).not.toThrow();

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      });

      it('outputs errors when multiple drivers are registered and last green driver fails while logging errors', () => {
        TestBed.configureTestingModule({
          imports: [
            LumberjackModule.forRoot({
              format: ({ level }) => level,
            }),
            SpyDriverModule.forRoot(),
            ErrorThrowingDriverModule.forRoot({ logsBeforeThrowing: 1 }),
          ],
        });
        const logDrivers = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
        const spyDriver = logDrivers[0] as SpyDriver;
        const errorDriver = logDrivers[1] as ErrorThrowingDriver;
        spyDriver.logDebug.and.throwError('The hidden spy made an error');
        spyOn(errorDriver, 'logDebug').and.callThrough();
        spyOn(errorDriver, 'logError').and.callThrough();

        expect(logDebugMessage).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).not.toHaveBeenCalled();
        expect(spyDriver.logDebug).toHaveBeenCalledWith(LumberjackLevel.Debug);

        expect(errorDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(errorDriver.logError).toHaveBeenCalledTimes(1);
        expect(errorDriver.logDebug).toHaveBeenCalledWith(LumberjackLevel.Debug);

        expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      });

      it('outputs only unprocessed driver errors', () => {
        TestBed.configureTestingModule({
          imports: [
            LumberjackModule.forRoot({
              format: ({ level }) => level,
            }),
            SpyDriverModule.forRoot(),
            ErrorThrowingDriverModule.forRoot({ logsBeforeThrowing: 2 }),
            NoopDriverModule.forRoot(),
          ],
        });
        const logDrivers = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
        const spyDriver = logDrivers[0] as SpyDriver;
        const errorDriver = logDrivers[1] as ErrorThrowingDriver;
        const noopDriver = logDrivers[2] as NoopDriver;
        spyDriver.logDebug.and.throwError('The hidden spy made an error');
        spyOn(errorDriver, 'logDebug').and.callThrough();
        spyOn(errorDriver, 'logError').and.callThrough();
        spyOn(noopDriver, 'logError').and.throwError('Noop is really an error');
        spyOn(noopDriver, 'logDebug').and.callThrough();

        expect(logDebugMessage).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).not.toHaveBeenCalled();
        expect(spyDriver.logDebug).toHaveBeenCalledWith(LumberjackLevel.Debug);

        expect(noopDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(noopDriver.logError).toHaveBeenCalledTimes(1);

        expect(errorDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(errorDriver.logError).toHaveBeenCalledTimes(2);
        expect(errorDriver.logDebug).toHaveBeenCalledWith(LumberjackLevel.Debug);

        expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      });

      it('logs an error message to stable drivers when a driver fails', () => {
        TestBed.configureTestingModule({
          imports: [
            LumberjackModule.forRoot({
              format: ({ level }) => level,
            }),
            SpyDriverModule.forRoot(),
            ErrorThrowingDriverModule.forRoot(),
          ],
        });
        const logDrivers = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
        const spyDriver = logDrivers[0] as SpyDriver;

        expect(logDebugMessage).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(LumberjackLevel.Debug);
        const [actualLastErrorMessage] = spyDriver.logError.calls.mostRecent().args as ReadonlyArray<string>;
        expect(actualLastErrorMessage).toMatch(
          new RegExp(`^Could not log message ".*?" to ${ErrorThrowingDriver.name}.\n Error: ".*?"`)
        );
        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });

      it('accepts logs when multiple log drivers are registered', () => {
        TestBed.configureTestingModule({
          imports: [
            LumberjackModule.forRoot({
              format: ({ level }) => level,
            }),
            ErrorThrowingDriverModule.forRoot(),
            SpyDriverModule.forRoot(),
          ],
        });
        const logDrivers = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
        const spyDriver = logDrivers[1] as SpyDriver;

        expect(logDebugMessage).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(LumberjackLevel.Debug);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });

      it('outputs an error mentioning the log entry and driver name recursively', () => {
        TestBed.configureTestingModule({
          imports: [
            LumberjackModule.forRoot(),
            SpyDriverModule.forRoot(),
            ErrorThrowingDriverModule.forRoot({ logsBeforeThrowing: 1 }),
          ],
        });
        const logDrivers = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
        const spyDriver = logDrivers[0] as SpyDriver;
        const errorDriver = logDrivers[1] as ErrorThrowingDriver;
        spyDriver.logDebug.and.throwError('The hidden spy made an error');
        spyOn(errorDriver, 'logDebug').and.callThrough();
        spyOn(errorDriver, 'logError').and.callThrough();

        logDebugMessage();

        const [actualLastErrorMessage] = consoleErrorSpy.calls.mostRecent().args as ReadonlyArray<string>;
        expect(actualLastErrorMessage).toMatch(
          new RegExp(`^Could not log message .*?\n.*? to ${ErrorThrowingDriver.name}.\n Error: .*?\n Error: .*?$`)
        );
        const [actualFirstErrorMessage] = consoleErrorSpy.calls.first().args as ReadonlyArray<string>;
        expect(actualFirstErrorMessage).toMatch(
          new RegExp(`^Could not log message ".*?" to ${SpyDriver.name}.\n Error: ".*?"$`)
        );
      });
    });
  });

  describe('Formatter', () => {
    describe('Error-throwing formatter', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            LumberjackModule.forRoot({
              format: () => {
                throw new Error('Test format error');
              },
            }),
            SpyDriverModule.forRoot(),
          ],
        });

        lumberjack = resolveDependency(LumberjackService);

        const [logDriver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
        spyDriver = logDriver as SpyDriver;
      });

      let lumberjack: LumberjackService;
      let spyDriver: SpyDriver;

      it('logs an error to a log driver', () => {
        lumberjack.log(createCriticalLog());

        expect(spyDriver.logError).toHaveBeenCalledTimes(1);
      });

      it('does not log a critical error to a log driver', () => {
        lumberjack.log(createCriticalLog());

        expect(spyDriver.logCritical).not.toHaveBeenCalled();
      });

      it('does not log a debug message to a log driver', () => {
        lumberjack.log(createDebugLog());

        expect(spyDriver.logDebug).not.toHaveBeenCalled();
      });

      it('does not log an info message to a log driver', () => {
        lumberjack.log(createInfoLog());

        expect(spyDriver.logInfo).not.toHaveBeenCalled();
      });

      it('does not log a trace to a log driver', () => {
        lumberjack.log(createTraceLog());

        expect(spyDriver.logTrace).not.toHaveBeenCalled();
      });

      it('does not log a warning to a log driver', () => {
        lumberjack.log(createWarningLog());

        expect(spyDriver.logWarning).not.toHaveBeenCalled();
      });
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

      const [logDriver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
      spyDriver = logDriver as SpyDriver;
    });

    let lumberjack: LumberjackService;
    let spyDriver: SpyDriver;

    it('logs a critical error to a log driver', () => {
      lumberjack.log(createCriticalLog());

      expect(spyDriver.logCritical).toHaveBeenCalledTimes(1);
      expect(spyDriver.logCritical).toHaveBeenCalledWith(LumberjackLevel.Critical);
    });

    it('logs a debug message to a log driver', () => {
      lumberjack.log(createDebugLog());

      expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
      expect(spyDriver.logDebug).toHaveBeenCalledWith(LumberjackLevel.Debug);
    });

    it('logs an error message to a log driver', () => {
      lumberjack.log(createErrorLog());

      expect(spyDriver.logError).toHaveBeenCalledTimes(1);
      expect(spyDriver.logError).toHaveBeenCalledWith(LumberjackLevel.Error);
    });

    it('logs an info message to a log driver', () => {
      lumberjack.log(createInfoLog());

      expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
      expect(spyDriver.logInfo).toHaveBeenCalledWith(LumberjackLevel.Info);
    });

    it('logs a trace to a log driver', () => {
      lumberjack.log(createTraceLog());

      expect(spyDriver.logTrace).toHaveBeenCalledTimes(1);
      expect(spyDriver.logTrace).toHaveBeenCalledWith(LumberjackLevel.Trace);
    });

    it('logs a warning to a log driver', () => {
      lumberjack.log(createWarningLog());

      expect(spyDriver.logWarning).toHaveBeenCalledTimes(1);
      expect(spyDriver.logWarning).toHaveBeenCalledWith(LumberjackLevel.Warning);
    });
  });

  describe('Log levels', () => {
    it('accepts logs when no log levels are enabled', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
        providers: [noLogsProvider],
      });

      expect(logDebugMessage).not.toThrow();
    });

    it('accepts logs when all log levels are enabled', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
        providers: [allLogsProvider],
      });

      expect(logDebugMessage).not.toThrow();
    });

    it('accepts logs when all log levels are enabled and a log driver is registered', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(), NoopDriverModule.forRoot()],
        providers: [allLogsProvider],
      });

      expect(logDebugMessage).not.toThrow();
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

      const [logDriver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
      spyDriver = logDriver as SpyDriver;
    });

    let lumberjack: LumberjackService;
    let spyDriver: SpyDriver;

    describe('when a log driver is registered', () => {
      it('debug entries are logged', () => {
        lumberjack.log(createDebugLog());

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(LumberjackLevel.Debug);
      });

      it('errors are logged', () => {
        lumberjack.log(createErrorLog());

        expect(spyDriver.logError).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).toHaveBeenCalledWith(LumberjackLevel.Error);
      });

      it('info is logged', () => {
        lumberjack.log(createInfoLog());

        expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
        expect(spyDriver.logInfo).toHaveBeenCalledWith(LumberjackLevel.Info);
      });

      it('warnings are logged', () => {
        lumberjack.log(createWarningLog());

        expect(spyDriver.logWarning).toHaveBeenCalledTimes(1);
        expect(spyDriver.logWarning).toHaveBeenCalledWith(LumberjackLevel.Warning);
      });
    });
  });

  describe('Multiple log drivers', () => {
    describe('given drivers with different log levels', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            LumberjackModule.forRoot({
              format: ({ level }) => level,
            }),
            SpyDriverModule.forRoot({
              levels: [LumberjackLevel.Debug, LumberjackLevel.Info, LumberjackLevel.Trace],
            }),
            NoopDriverModule.forRoot({
              levels: [LumberjackLevel.Critical, LumberjackLevel.Error, LumberjackLevel.Warning],
            }),
          ],
          providers: [verboseLoggingProvider],
        });

        lumberjack = resolveDependency(LumberjackService);

        const [_spyDriver, _noopDriver] = (resolveDependency(
          lumberjackLogDriverToken
        ) as unknown) as LumberjackLogDriver[];
        spyDriver = _spyDriver as SpyDriver;
        noopDriver = _noopDriver as jasmine.SpyObj<NoopDriver>;
        spyOn(noopDriver, 'logCritical');
        spyOn(noopDriver, 'logDebug');
        spyOn(noopDriver, 'logError');
        spyOn(noopDriver, 'logInfo');
        spyOn(noopDriver, 'logTrace');
        spyOn(noopDriver, 'logWarning');
      });

      beforeEach(() => {
        lumberjack.log(createCriticalLog());
        lumberjack.log(createDebugLog());
        lumberjack.log(createErrorLog());
        lumberjack.log(createInfoLog());
        lumberjack.log(createTraceLog());
        lumberjack.log(createWarningLog());
      });

      let lumberjack: LumberjackService;
      let noopDriver: jasmine.SpyObj<NoopDriver>;
      let spyDriver: SpyDriver;

      it('then logs of configured levels are passed to each of them', () => {
        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(LumberjackLevel.Debug);
        expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
        expect(spyDriver.logInfo).toHaveBeenCalledWith(LumberjackLevel.Info);
        expect(spyDriver.logTrace).toHaveBeenCalledTimes(1);
        expect(spyDriver.logTrace).toHaveBeenCalledWith(LumberjackLevel.Trace);

        expect(noopDriver.logCritical).toHaveBeenCalledTimes(1);
        expect(noopDriver.logCritical).toHaveBeenCalledWith(LumberjackLevel.Critical);
        expect(noopDriver.logError).toHaveBeenCalledTimes(1);
        expect(noopDriver.logError).toHaveBeenCalledWith(LumberjackLevel.Error);
        expect(noopDriver.logWarning).toHaveBeenCalledTimes(1);
        expect(noopDriver.logWarning).toHaveBeenCalledWith(LumberjackLevel.Warning);
      });

      it('then logs of other levels are not passed to either of them', () => {
        expect(spyDriver.logCritical).not.toHaveBeenCalled();
        expect(spyDriver.logError).not.toHaveBeenCalled();
        expect(spyDriver.logWarning).not.toHaveBeenCalled();

        expect(noopDriver.logDebug).not.toHaveBeenCalled();
        expect(noopDriver.logInfo).not.toHaveBeenCalled();
        expect(noopDriver.logTrace).not.toHaveBeenCalled();
      });
    });
  });
});
