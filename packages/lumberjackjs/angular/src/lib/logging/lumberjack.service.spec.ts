import { StaticProvider } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  ErrorThrowingDriverModule,
  FakeTimeService,
  NoopDriverModule,
  ObjectDriverModule,
  ObjectService,
  SpyDriverModule,
} from '@internal/angular/test-util';
import {
  createCriticalDriverLog,
  createDebugDriverLog,
  createErrorDriverLog,
  createFakeTime,
  createInfoDriverLog,
  createTraceDriverLog,
  createWarningDriverLog,
  ErrorThrowingDriver,
  errorThrowingDriverIdentifier,
  NoopDriver,
  noopDriverIdentifier,
  ObjectPayload,
  SpyDriver,
  spyDriverIdentifier,
} from '@internal/core/test-util';
import {
  createLumberjackLogFactory,
  LumberjackLevel,
  LumberjackLogDriver,
  LumberjackLogDriverConfig,
  LumberjackLogDriverLog,
  LumberjackLogPayload,
} from '@lumberjackjs/core';

import { lumberjackLogDriverConfigToken } from '../configuration/lumberjack-log-driver-config.token';
import { LumberjackModule } from '../configuration/lumberjack.module';
import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackService } from './lumberjack.service';

class SpyDriverError extends Error {
  constructor(message = 'SpyDriverError') {
    super(message);
    this.name = 'SpyDriverError';

    // Non-standard V8 function for maintaining a stack trace
    const ErrorWithCaptureStackTrace = Error as unknown as Error & {
      // eslint-disable-next-line @typescript-eslint/ban-types
      captureStackTrace?: (error: Error, constructor: Function) => void;
    };
    ErrorWithCaptureStackTrace.captureStackTrace?.(this, this.constructor);
  }
}

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
const fakeTime = createFakeTime();
fakeTime.setTime(fakeDate);

interface PayloadFieldInfo extends LumberjackLogPayload {
  payloadInfo: string;
}

const payloadInfo: PayloadFieldInfo = { payloadInfo: 'PayloadINFO' };
const objectPayloadInfo: ObjectPayload = { isWorking: true };
const logFactory = createLumberjackLogFactory({ getUnixEpochTicks: fakeTime.getUnixEpochTicks.bind(fakeTime) });
const logFactoryWithPayload = createLumberjackLogFactory<PayloadFieldInfo>({
  getUnixEpochTicks: fakeTime.getUnixEpochTicks.bind(fakeTime),
});
const logFactoryWithObjectPayload = createLumberjackLogFactory<ObjectPayload>({
  getUnixEpochTicks: fakeTime.getUnixEpochTicks.bind(fakeTime),
});

const logDebugMessage = () =>
  TestBed.inject(LumberjackService).log(logFactory.createDebugLog('').withScope('Test').build());
const logDebugMessageWithPayloadField = () =>
  TestBed.inject<LumberjackService<PayloadFieldInfo>>(LumberjackService).log(
    logFactoryWithPayload.createDebugLog('').withScope('Test').withPayload(payloadInfo).build()
  );
const logDebugMessageWithObjectPayloadField = () =>
  TestBed.inject<LumberjackService<ObjectPayload>>(LumberjackService).log(
    logFactoryWithObjectPayload.createDebugLog('').withScope('Test').withPayload(objectPayloadInfo).build()
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
        imports: [LumberjackModule.forRoot(), NoopDriverModule.forRoot(), SpyDriverModule.forRoot()],
      });

      expect(logDebugMessage).not.toThrow();
    });

    describe('Drivers with custom lumberjack logs', () => {
      it('receives the payload parameter in the provided driver', () => {
        TestBed.configureTestingModule({
          imports: [LumberjackModule.forRoot(), SpyDriverModule.forRoot()],
          providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }],
        });
        const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
        fakeTime.setTime(fakeDate);

        const [spyDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as SpyDriver<PayloadFieldInfo>[];

        expect(logDebugMessageWithPayloadField).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(
            fakeTime.getUnixEpochTicks.bind(fakeTime),
            `debug ${fakeDate.toISOString()} [Test] `,
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

        const objectService = TestBed.inject(ObjectService);
        const objectLogSpy = jest.spyOn(objectService, 'log');

        expect(logDebugMessageWithObjectPayloadField).not.toThrow();

        expect(objectLogSpy).toHaveBeenCalledWith(objectPayloadInfo);
      });
    });

    describe('Error-throwing log drivers', () => {
      beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
          /* do nothing */
        });
      });

      let consoleErrorSpy: jest.SpyInstance<void, unknown[]>;

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
          providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }],
        });
        const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
        fakeTime.setTime(fakeDate);
        const [spyDriver, errorDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as [
          SpyDriver,
          ErrorThrowingDriver
        ];
        spyDriver.logDebug.mockImplementation(() => {
          throw new SpyDriverError();
        });
        const errorDebugSpy = jest.spyOn(errorDriver, 'logDebug');
        const errorErrorSpy = jest.spyOn(errorDriver, 'logError');

        expect(logDebugMessage).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).not.toHaveBeenCalled();
        expect(spyDriver.logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Debug)
        );

        expect(errorDebugSpy).toHaveBeenCalledTimes(1);
        expect(errorErrorSpy).toHaveBeenCalledTimes(1);
        expect(errorDebugSpy).toHaveBeenCalledWith(
          createDebugDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Debug)
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
          providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }],
        });
        const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
        fakeTime.setTime(fakeDate);
        const [spyDriver, errorDriver, noopDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as [
          SpyDriver,
          ErrorThrowingDriver,
          NoopDriver
        ];
        spyDriver.logDebug.mockImplementation(() => {
          throw new SpyDriverError();
        });
        const errorDebugSpy = jest.spyOn(errorDriver, 'logDebug');
        const errorErrorSpy = jest.spyOn(errorDriver, 'logError');
        const noopErrorSpy = jest.spyOn(noopDriver, 'logError').mockImplementation(() => {
          throw new Error('Noop is really an error');
        });
        const noopDebugSpy = jest.spyOn(noopDriver, 'logDebug');

        expect(logDebugMessage).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).not.toHaveBeenCalled();
        expect(spyDriver.logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Debug)
        );

        expect(noopDebugSpy).toHaveBeenCalledTimes(1);
        expect(noopErrorSpy.mock.results[0].type).toBe('throw');
        expect(noopErrorSpy).toHaveBeenCalledTimes(1);

        expect(errorDebugSpy).toHaveBeenCalledTimes(1);
        expect(errorErrorSpy).toHaveBeenCalledTimes(2);
        expect(errorDebugSpy).toHaveBeenCalledWith(
          createDebugDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Debug)
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
          providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }],
        });
        const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
        fakeTime.setTime(fakeDate);
        const logDrivers = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
        const spyDriver = logDrivers[0] as SpyDriver;

        expect(logDebugMessage).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Debug)
        );
        const [actualLastErrorMessage] = spyDriver.logError.mock.calls[
          spyDriver.logError.mock.calls.length - 1
        ] as LumberjackLogDriverLog[];
        expect(actualLastErrorMessage.formattedLog).toMatch(
          new RegExp(`^Could not log message ".*?" to ${errorThrowingDriverIdentifier}.\n Error: ".*?"`)
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
          providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }],
        });
        const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
        fakeTime.setTime(fakeDate);
        const logDrivers = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
        const spyDriver = logDrivers[1] as SpyDriver;

        expect(logDebugMessage).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Debug)
        );
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
        const logDrivers = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
        const spyDriver = logDrivers[0] as SpyDriver;
        const errorDriver = logDrivers[1] as ErrorThrowingDriver;
        spyDriver.logDebug.mockImplementation(() => {
          throw new SpyDriverError();
        });
        jest.spyOn(errorDriver, 'logDebug');
        jest.spyOn(errorDriver, 'logError');

        logDebugMessage();

        const [actualLastErrorMessage] = consoleErrorSpy.mock.calls[consoleErrorSpy.mock.calls.length - 1] as string[];
        expect(actualLastErrorMessage).toMatch(
          new RegExp(`^Could not log message .*?\n.*? to ${errorThrowingDriverIdentifier}.\n Error: .*?\n Error: .*?$`)
        );
        const [actualFirstErrorMessage] = consoleErrorSpy.mock.calls[0] as string[];
        expect(actualFirstErrorMessage).toMatch(
          new RegExp(`^Could not log message ".*?" to ${spyDriverIdentifier}.\n Error: ".*?"$`)
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

        lumberjack = TestBed.inject(LumberjackService) as LumberjackService;

        const [logDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
        spyDriver = logDriver as SpyDriver;
      });

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
        providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }],
      });
      const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
      fakeTime.setTime(fakeDate);

      lumberjack = TestBed.inject(LumberjackService) as LumberjackService;

      const [logDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
      spyDriver = logDriver as SpyDriver;
    });

    let lumberjack: LumberjackService;
    let spyDriver: SpyDriver;

    it('logs a critical error to a log driver', () => {
      lumberjack.log(logFactory.createCriticalLog('').withScope('Test').build());

      expect(spyDriver.logCritical).toHaveBeenCalledTimes(1);
      expect(spyDriver.logCritical).toHaveBeenCalledWith(
        createCriticalDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Critical)
      );
    });

    it('logs a debug message to a log driver', () => {
      lumberjack.log(logFactory.createDebugLog('').withScope('Test').build());

      expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
      expect(spyDriver.logDebug).toHaveBeenCalledWith(
        createDebugDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Debug)
      );
    });

    it('logs an error message to a log driver', () => {
      lumberjack.log(logFactory.createErrorLog('').withScope('Test').build());

      expect(spyDriver.logError).toHaveBeenCalledTimes(1);
      expect(spyDriver.logError).toHaveBeenCalledWith(
        createErrorDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Error)
      );
    });

    it('logs an info message to a log driver', () => {
      lumberjack.log(logFactory.createInfoLog('').withScope('Test').build());

      expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
      expect(spyDriver.logInfo).toHaveBeenCalledWith(
        createInfoDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Info)
      );
    });

    it('logs a trace to a log driver', () => {
      lumberjack.log(logFactory.createTraceLog('').withScope('Test').build());

      expect(spyDriver.logTrace).toHaveBeenCalledTimes(1);
      expect(spyDriver.logTrace).toHaveBeenCalledWith(
        createTraceDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Trace)
      );
    });

    it('logs a warning to a log driver', () => {
      lumberjack.log(logFactory.createWarningLog('').withScope('Test').build());

      expect(spyDriver.logWarning).toHaveBeenCalledTimes(1);
      expect(spyDriver.logWarning).toHaveBeenCalledWith(
        createWarningDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Warning)
      );
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
        providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }, verboseLoggingProvider],
      });
      const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
      fakeTime.setTime(fakeDate);

      lumberjack = TestBed.inject(LumberjackService) as LumberjackService;

      const [logDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
      spyDriver = logDriver as SpyDriver;
    });

    let lumberjack: LumberjackService;
    let spyDriver: SpyDriver;

    describe('when a log driver is registered', () => {
      const scope = 'Verbose';

      it('debug logs are logged', () => {
        lumberjack.log(logFactory.createDebugLog('').withScope(scope).build());

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Debug, undefined, scope)
        );
      });

      it('errors are logged', () => {
        lumberjack.log(logFactory.createErrorLog('').withScope(scope).build());

        expect(spyDriver.logError).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).toHaveBeenCalledWith(
          createErrorDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Error, undefined, scope)
        );
      });

      it('info is logged', () => {
        lumberjack.log(logFactory.createInfoLog('').withScope(scope).build());

        expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
        expect(spyDriver.logInfo).toHaveBeenCalledWith(
          createInfoDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Info, undefined, scope)
        );
      });

      it('warnings are logged', () => {
        lumberjack.log(logFactory.createWarningLog('').withScope(scope).build());

        expect(spyDriver.logWarning).toHaveBeenCalledTimes(1);
        expect(spyDriver.logWarning).toHaveBeenCalledWith(
          createWarningDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Warning, undefined, scope)
        );
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
              identifier: spyDriverIdentifier,
            }),
            NoopDriverModule.forRoot({
              levels: [LumberjackLevel.Critical, LumberjackLevel.Error, LumberjackLevel.Warning],
              identifier: noopDriverIdentifier,
            }),
          ],
          providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }, verboseLoggingProvider],
        });
        const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
        fakeTime.setTime(fakeDate);

        lumberjack = TestBed.inject(LumberjackService) as LumberjackService;

        const [_spyDriver, _noopDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
        spyDriver = _spyDriver as SpyDriver;
        noopDriver = _noopDriver as jest.Mocked<NoopDriver>;
        jest.spyOn(noopDriver, 'logCritical');
        jest.spyOn(noopDriver, 'logDebug');
        jest.spyOn(noopDriver, 'logError');
        jest.spyOn(noopDriver, 'logInfo');
        jest.spyOn(noopDriver, 'logTrace');
        jest.spyOn(noopDriver, 'logWarning');
      });

      beforeEach(() => {
        lumberjack.log(logFactory.createCriticalLog('').withScope('Test').build());
        lumberjack.log(logFactory.createDebugLog('').withScope('Test').build());
        lumberjack.log(logFactory.createErrorLog('').withScope('Test').build());
        lumberjack.log(logFactory.createInfoLog('').withScope('Test').build());
        lumberjack.log(logFactory.createTraceLog('').withScope('Test').build());
        lumberjack.log(logFactory.createWarningLog('').withScope('Test').build());
      });

      let lumberjack: LumberjackService;
      let noopDriver: jest.Mocked<NoopDriver>;
      let spyDriver: SpyDriver;

      it('then logs of configured levels are passed to each of them', () => {
        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Debug)
        );
        expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
        expect(spyDriver.logInfo).toHaveBeenCalledWith(
          createInfoDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Info)
        );
        expect(spyDriver.logTrace).toHaveBeenCalledTimes(1);
        expect(spyDriver.logTrace).toHaveBeenCalledWith(
          createTraceDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Trace)
        );

        expect(noopDriver.logCritical).toHaveBeenCalledTimes(1);
        expect((noopDriver as LumberjackLogDriver).logCritical).toHaveBeenCalledWith(
          createCriticalDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Critical)
        );
        expect(noopDriver.logError).toHaveBeenCalledTimes(1);
        expect((noopDriver as LumberjackLogDriver).logError).toHaveBeenCalledWith(
          createErrorDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Error)
        );
        expect(noopDriver.logWarning).toHaveBeenCalledTimes(1);
        expect((noopDriver as LumberjackLogDriver).logWarning).toHaveBeenCalledWith(
          createWarningDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Warning)
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
