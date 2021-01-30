import { StaticProvider } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NoopConsoleModule } from '@internal/console-driver/test-util';
import {
  createCriticalDriverLog,
  createDebugDriverLog,
  createErrorDriverLog,
  createInfoDriverLog,
  createTraceDriverLog,
  createWarningDriverLog,
  ErrorThrowingDriver,
  ErrorThrowingDriverModule,
  NoopDriver,
  NoopDriverModule,
  ObjectDriverModule,
  ObjectPayload,
  ObjectService,
  resolveDependency,
  SpyDriver,
  SpyDriverModule,
} from '@internal/test-util';
import { LumberjackConsoleDriverModule } from '@ngworker/lumberjack/console-driver';

import { lumberjackLogDriverConfigToken } from '../configuration/lumberjack-log-driver-config.token';
import { LumberjackLogDriverConfig } from '../configuration/lumberjack-log-driver.config';
import { LumberjackModule } from '../configuration/lumberjack.module';
import { LumberjackLogDriver } from '../log-drivers/lumberjack-log-driver';
import { LumberjackLogDriverLog } from '../log-drivers/lumberjack-log-driver.log';
import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogFactory } from './lumberjack-log-factory';
import { LumberjackService } from './lumberjack.service';

const noLogsConfig: Omit<LumberjackLogDriverConfig, 'identifier'> = {
  levels: [],
};
const noLogsProvider: StaticProvider = {
  provide: lumberjackLogDriverConfigToken,
  useValue: noLogsConfig,
};
const allLogsConfig: Omit<LumberjackLogDriverConfig, 'identifier'> = {
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
const verboseLoggingConfig: Omit<LumberjackLogDriverConfig, 'identifier'> = {
  levels: [LumberjackLevel.Verbose],
};
const verboseLoggingProvider: StaticProvider = {
  provide: lumberjackLogDriverConfigToken,
  useValue: verboseLoggingConfig,
};
const fakeDate = new Date('2020-02-02T02:02:02.000Z');

interface PayloadFieldInfo extends LumberjackLogPayload {
  payloadInfo: string;
}

const payloadInfo: PayloadFieldInfo = { payloadInfo: 'PayloadINFO' };
const objectPayloadInfo: ObjectPayload = { isWorking: true };

const logDebugMessage = () =>
  resolveDependency(LumberjackService).log(
    resolveDependency(LumberjackLogFactory).createDebugLog('').withScope('Test').build()
  );
const logDebugMessageWithPayloadField = () =>
  resolveDependency<LumberjackService<PayloadFieldInfo>>(LumberjackService).log(
    resolveDependency(LumberjackLogFactory).createDebugLog('').withScope('Test').withPayload(payloadInfo).build()
  );
const logDebugMessageWithObjectPayloadField = () =>
  resolveDependency<LumberjackService<ObjectPayload>>(LumberjackService).log(
    resolveDependency(LumberjackLogFactory).createDebugLog('').withScope('Test').withPayload(objectPayloadInfo).build()
  );

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
          LumberjackConsoleDriverModule.forRoot(),
          NoopConsoleModule,
        ],
      });

      expect(logDebugMessage).not.toThrow();
    });

    describe('Drivers with custom lumberjack logs', () => {
      it('receives the payload parameter in the provided driver', () => {
        TestBed.configureTestingModule({
          imports: [LumberjackModule.forRoot(), SpyDriverModule.forRoot()],
        });
        const fakeTime = resolveDependency(LumberjackTimeService);
        spyOn(fakeTime, 'getUnixEpochTicks').and.returnValue(fakeDate.valueOf());

        const logDrivers = (resolveDependency(
          lumberjackLogDriverToken
        ) as unknown) as LumberjackLogDriver<PayloadFieldInfo>[];
        const spyDriver = logDrivers[0] as SpyDriver;

        expect(logDebugMessageWithPayloadField).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(
            // tslint:disable-next-line: no-any
            jest.fn(String) as any,
            undefined,
            undefined,
            payloadInfo
          )
        );
      });

      it('uses the payload as part of driver logic', () => {
        TestBed.configureTestingModule({
          imports: [LumberjackModule.forRoot(), ObjectDriverModule.forRoot()],
        });

        const objectService = resolveDependency(ObjectService);
        spyOn(objectService, 'log').and.callThrough();

        expect(logDebugMessageWithObjectPayloadField).not.toThrow();

        expect(objectService.log).toHaveBeenCalledWith(objectPayloadInfo);
      });
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
        const fakeTime = resolveDependency(LumberjackTimeService);
        spyOn(fakeTime, 'getUnixEpochTicks').and.returnValue(fakeDate.valueOf());
        const logDrivers = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
        const spyDriver = logDrivers[0] as SpyDriver;
        const errorDriver = logDrivers[1] as ErrorThrowingDriver;
        spyDriver.logDebug.and.throwError('The hidden spy made an error');
        spyOn(errorDriver, 'logDebug').and.callThrough();
        spyOn(errorDriver, 'logError').and.callThrough();

        expect(logDebugMessage).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).not.toHaveBeenCalled();
        expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog(LumberjackLevel.Debug));

        expect(errorDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(errorDriver.logError).toHaveBeenCalledTimes(1);
        expect((errorDriver as LumberjackLogDriver).logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(LumberjackLevel.Debug)
        );

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
        const fakeTime = resolveDependency(LumberjackTimeService);
        spyOn(fakeTime, 'getUnixEpochTicks').and.returnValue(fakeDate.valueOf());
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
        expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog(LumberjackLevel.Debug));

        expect(noopDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(noopDriver.logError).toHaveBeenCalledTimes(1);

        expect(errorDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(errorDriver.logError).toHaveBeenCalledTimes(2);
        expect((errorDriver as LumberjackLogDriver).logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(LumberjackLevel.Debug)
        );

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
        const fakeTime = resolveDependency(LumberjackTimeService);
        spyOn(fakeTime, 'getUnixEpochTicks').and.returnValue(fakeDate.valueOf());
        const logDrivers = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
        const spyDriver = logDrivers[0] as SpyDriver;

        expect(logDebugMessage).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog(LumberjackLevel.Debug));
        const [actualLastErrorMessage] = spyDriver.logError.calls.mostRecent()
          .args as ReadonlyArray<LumberjackLogDriverLog>;
        expect(actualLastErrorMessage.formattedLog).toMatch(
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
        const fakeTime = resolveDependency(LumberjackTimeService);
        spyOn(fakeTime, 'getUnixEpochTicks').and.returnValue(fakeDate.valueOf());
        const logDrivers = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
        const spyDriver = logDrivers[1] as SpyDriver;

        expect(logDebugMessage).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog(LumberjackLevel.Debug));
        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });

      it('outputs an error mentioning the log and log driver name recursively', () => {
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

        lumberjack = resolveDependency(LumberjackService) as LumberjackService;

        const [logDriver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
        spyDriver = logDriver as SpyDriver;
        logFactory = resolveDependency(LumberjackLogFactory);
      });

      let logFactory: LumberjackLogFactory;
      let lumberjack: LumberjackService;
      let spyDriver: SpyDriver;

      it('logs an error to a log driver', () => {
        lumberjack.log(logFactory.createCriticalLog('').build());

        expect(spyDriver.logError).toHaveBeenCalledTimes(1);
      });

      it('does not log a critical error to a log driver', () => {
        lumberjack.log(logFactory.createCriticalLog('').build());

        expect(spyDriver.logCritical).not.toHaveBeenCalled();
      });

      it('does not log a debug message to a log driver', () => {
        lumberjack.log(logFactory.createDebugLog('').build());

        expect(spyDriver.logDebug).not.toHaveBeenCalled();
      });

      it('does not log an info message to a log driver', () => {
        lumberjack.log(logFactory.createInfoLog('').build());

        expect(spyDriver.logInfo).not.toHaveBeenCalled();
      });

      it('does not log a trace to a log driver', () => {
        lumberjack.log(logFactory.createTraceLog('').build());

        expect(spyDriver.logTrace).not.toHaveBeenCalled();
      });

      it('does not log a warning to a log driver', () => {
        lumberjack.log(logFactory.createWarningLog('').build());

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

      lumberjack = resolveDependency(LumberjackService) as LumberjackService;

      const [logDriver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
      spyDriver = logDriver as SpyDriver;

      const fakeTime = resolveDependency(LumberjackTimeService);
      spyOn(fakeTime, 'getUnixEpochTicks').and.returnValue(fakeDate.valueOf());
      logFactory = resolveDependency(LumberjackLogFactory);
    });

    let logFactory: LumberjackLogFactory;
    let lumberjack: LumberjackService;
    let spyDriver: SpyDriver;

    it('logs a critical error to a log driver', () => {
      lumberjack.log(logFactory.createCriticalLog('').withScope('Test').build());

      expect(spyDriver.logCritical).toHaveBeenCalledTimes(1);
      expect(spyDriver.logCritical).toHaveBeenCalledWith(createCriticalDriverLog(LumberjackLevel.Critical));
    });

    it('logs a debug message to a log driver', () => {
      lumberjack.log(logFactory.createDebugLog('').withScope('Test').build());

      expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
      expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog(LumberjackLevel.Debug));
    });

    it('logs an error message to a log driver', () => {
      lumberjack.log(logFactory.createErrorLog('').withScope('Test').build());

      expect(spyDriver.logError).toHaveBeenCalledTimes(1);
      expect(spyDriver.logError).toHaveBeenCalledWith(createErrorDriverLog(LumberjackLevel.Error));
    });

    it('logs an info message to a log driver', () => {
      lumberjack.log(logFactory.createInfoLog('').withScope('Test').build());

      expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
      expect(spyDriver.logInfo).toHaveBeenCalledWith(createInfoDriverLog(LumberjackLevel.Info));
    });

    it('logs a trace to a log driver', () => {
      lumberjack.log(logFactory.createTraceLog('').withScope('Test').build());

      expect(spyDriver.logTrace).toHaveBeenCalledTimes(1);
      expect(spyDriver.logTrace).toHaveBeenCalledWith(createTraceDriverLog(LumberjackLevel.Trace));
    });

    it('logs a warning to a log driver', () => {
      lumberjack.log(logFactory.createWarningLog('').withScope('Test').build());

      expect(spyDriver.logWarning).toHaveBeenCalledTimes(1);
      expect(spyDriver.logWarning).toHaveBeenCalledWith(createWarningDriverLog(LumberjackLevel.Warning));
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

      lumberjack = resolveDependency(LumberjackService) as LumberjackService;

      const [logDriver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
      spyDriver = logDriver as SpyDriver;

      const fakeTime = resolveDependency(LumberjackTimeService);
      spyOn(fakeTime, 'getUnixEpochTicks').and.returnValue(fakeDate.valueOf());
      logFactory = resolveDependency(LumberjackLogFactory);
    });

    let logFactory: LumberjackLogFactory;
    let lumberjack: LumberjackService;
    let spyDriver: SpyDriver;

    describe('when a log driver is registered', () => {
      it('debug logs are logged', () => {
        lumberjack.log(logFactory.createDebugLog('').withScope('Test').build());

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog(LumberjackLevel.Debug));
      });

      it('errors are logged', () => {
        lumberjack.log(logFactory.createErrorLog('').withScope('Test').build());

        expect(spyDriver.logError).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).toHaveBeenCalledWith(createErrorDriverLog(LumberjackLevel.Error));
      });

      it('info is logged', () => {
        lumberjack.log(logFactory.createInfoLog('').withScope('Test').build());

        expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
        expect(spyDriver.logInfo).toHaveBeenCalledWith(createInfoDriverLog(LumberjackLevel.Info));
      });

      it('warnings are logged', () => {
        lumberjack.log(logFactory.createWarningLog('').withScope('Test').build());

        expect(spyDriver.logWarning).toHaveBeenCalledTimes(1);
        expect(spyDriver.logWarning).toHaveBeenCalledWith(createWarningDriverLog(LumberjackLevel.Warning));
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
              identifier: SpyDriver.name,
            }),
            NoopDriverModule.forRoot({
              levels: [LumberjackLevel.Critical, LumberjackLevel.Error, LumberjackLevel.Warning],
              identifier: NoopDriver.name,
            }),
          ],
          providers: [verboseLoggingProvider],
        });

        lumberjack = resolveDependency(LumberjackService) as LumberjackService;

        const fakeTime = resolveDependency(LumberjackTimeService);
        spyOn(fakeTime, 'getUnixEpochTicks').and.returnValue(fakeDate.valueOf());

        const [_spyDriver, _noopDriver] = (resolveDependency(
          lumberjackLogDriverToken
        ) as unknown) as LumberjackLogDriver[];
        spyDriver = _spyDriver as SpyDriver;
        noopDriver = _noopDriver as jest.Mocked<NoopDriver>;
        jest.spyOn(noopDriver, 'logCritical');
        jest.spyOn(noopDriver, 'logDebug');
        jest.spyOn(noopDriver, 'logError');
        jest.spyOn(noopDriver, 'logInfo');
        jest.spyOn(noopDriver, 'logTrace');
        jest.spyOn(noopDriver, 'logWarning');
        logFactory = resolveDependency(LumberjackLogFactory);
      });

      beforeEach(() => {
        lumberjack.log(logFactory.createCriticalLog('').withScope('Test').build());
        lumberjack.log(logFactory.createDebugLog('').withScope('Test').build());
        lumberjack.log(logFactory.createErrorLog('').withScope('Test').build());
        lumberjack.log(logFactory.createInfoLog('').withScope('Test').build());
        lumberjack.log(logFactory.createTraceLog('').withScope('Test').build());
        lumberjack.log(logFactory.createWarningLog('').withScope('Test').build());
      });

      let logFactory: LumberjackLogFactory;
      let lumberjack: LumberjackService;
      let noopDriver: jest.Mocked<NoopDriver>;
      let spyDriver: SpyDriver;

      it('then logs of configured levels are passed to each of them', () => {
        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog(LumberjackLevel.Debug));
        expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
        expect(spyDriver.logInfo).toHaveBeenCalledWith(createInfoDriverLog(LumberjackLevel.Info));
        expect(spyDriver.logTrace).toHaveBeenCalledTimes(1);
        expect(spyDriver.logTrace).toHaveBeenCalledWith(createTraceDriverLog(LumberjackLevel.Trace));

        expect(noopDriver.logCritical).toHaveBeenCalledTimes(1);
        expect((noopDriver as LumberjackLogDriver).logCritical).toHaveBeenCalledWith(
          createCriticalDriverLog(LumberjackLevel.Critical)
        );
        expect(noopDriver.logError).toHaveBeenCalledTimes(1);
        expect((noopDriver as LumberjackLogDriver).logError).toHaveBeenCalledWith(
          createErrorDriverLog(LumberjackLevel.Error)
        );
        expect(noopDriver.logWarning).toHaveBeenCalledTimes(1);
        expect((noopDriver as LumberjackLogDriver).logWarning).toHaveBeenCalledWith(
          createWarningDriverLog(LumberjackLevel.Warning)
        );
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
