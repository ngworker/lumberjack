import { StaticProvider } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideNoopConsole } from '@internal/console-driver/test-util';
import {
  createCriticalDriverLog,
  createDebugDriverLog,
  createErrorDriverLog,
  createInfoDriverLog,
  createTraceDriverLog,
  createWarningDriverLog,
  ErrorThrowingDriver,
  FakeTimeService,
  NoopDriver,
  ObjectPayload,
  ObjectService,
  provideErrorThrowingDriver,
  provideNoopDriver,
  provideObjectDriver,
  provideSpyDriver,
  SpyDriver,
} from '@internal/test-util';
import { provideLumberjackConsoleDriver } from '@ngworker/lumberjack/console-driver';

import { lumberjackLogDriverConfigToken } from '../configuration/lumberjack-log-driver-config.token';
import { LumberjackLogDriverConfig } from '../configuration/lumberjack-log-driver.config';
import { LumberjackLogDriver } from '../log-drivers/lumberjack-log-driver';
import { LumberjackLogDriverLog } from '../log-drivers/lumberjack-log-driver.log';
import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackTimeService } from '../time/lumberjack-time.service';
import { provideLumberjack } from '../configuration/provide-lumberjack';

import { LumberjackLogFactory } from './lumberjack-log-factory';
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
  levels: ['critical', 'debug', 'error', 'info', 'trace', 'warn'],
};
const allLogsProvider: StaticProvider = {
  provide: lumberjackLogDriverConfigToken,
  useValue: allLogsConfig,
};
const verboseLoggingConfig: Omit<LumberjackLogDriverConfig, 'identifier'> = {
  levels: ['verbose'],
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
  TestBed.inject(LumberjackService).log(
    TestBed.inject(LumberjackLogFactory).createDebugLog('').withScope('Test').build()
  );
const logDebugMessageWithPayloadField = () =>
  TestBed.inject<LumberjackService<PayloadFieldInfo>>(LumberjackService).log(
    TestBed.inject(LumberjackLogFactory).createDebugLog('').withScope('Test').withPayload(payloadInfo).build()
  );
const logDebugMessageWithObjectPayloadField = () =>
  TestBed.inject<LumberjackService<ObjectPayload>>(LumberjackService).log(
    TestBed.inject(LumberjackLogFactory).createDebugLog('').withScope('Test').withPayload(objectPayloadInfo).build()
  );

describe(LumberjackService.name, () => {
  describe('Log drivers', () => {
    it('accepts logs when no log drivers are registered', () => {
      TestBed.configureTestingModule({
        providers: [provideLumberjack()],
      });

      expect(logDebugMessage).not.toThrow();
    });

    it('accepts logs when a single log driver is registered', () => {
      TestBed.configureTestingModule({
        providers: [provideLumberjack(), provideNoopDriver()],
      });

      expect(logDebugMessage).not.toThrow();
    });

    it('accepts logs when multiple log drivers are registered', () => {
      TestBed.configureTestingModule({
        providers: [provideLumberjack(), provideNoopConsole(), provideNoopDriver(), provideLumberjackConsoleDriver()],
      });

      expect(logDebugMessage).not.toThrow();
    });

    describe('Drivers with custom lumberjack logs', () => {
      it('receives the payload parameter in the provided driver', () => {
        TestBed.configureTestingModule({
          providers: [
            provideLumberjack(),
            { provide: LumberjackTimeService, useClass: FakeTimeService },
            provideSpyDriver(),
          ],
        });
        const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
        fakeTime.setTime(fakeDate);

        const [spyDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as SpyDriver<PayloadFieldInfo>[];

        expect(logDebugMessageWithPayloadField).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(`debug ${fakeDate.toISOString()} [Test] `, undefined, undefined, payloadInfo)
        );
      });

      it('uses the payload as part of driver logic', () => {
        TestBed.configureTestingModule({
          providers: [provideLumberjack(), provideObjectDriver()],
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
          providers: [provideLumberjack(), provideErrorThrowingDriver()],
        });

        expect(logDebugMessage).not.toThrow();

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      });

      it('outputs errors when multiple drivers are registered and last green driver fails while logging errors', () => {
        TestBed.configureTestingModule({
          providers: [
            provideLumberjack({
              format: ({ level }) => level,
            }),
            { provide: LumberjackTimeService, useClass: FakeTimeService },
            provideSpyDriver(),
            provideErrorThrowingDriver({ logsBeforeThrowing: 1 }),
          ],
        });
        const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
        fakeTime.setTime(fakeDate);
        const [spyDriver, errorDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as [
          SpyDriver,
          ErrorThrowingDriver
        ];
        console.log(errorDriver);
        spyDriver.logDebug.mockImplementation(() => {
          throw new SpyDriverError();
        });
        const errorDebugSpy = jest.spyOn(errorDriver, 'logDebug');
        const errorErrorSpy = jest.spyOn(errorDriver, 'logError');

        expect(logDebugMessage).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).not.toHaveBeenCalled();
        expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog('debug'));

        expect(errorDebugSpy).toHaveBeenCalledTimes(1);
        expect(errorErrorSpy).toHaveBeenCalledTimes(1);
        expect(errorDebugSpy).toHaveBeenCalledWith(createDebugDriverLog('debug'));

        expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      });

      it('outputs only unprocessed driver errors', () => {
        TestBed.configureTestingModule({
          providers: [
            provideLumberjack({
              format: ({ level }) => level,
            }),
            provideSpyDriver(),
            { provide: LumberjackTimeService, useClass: FakeTimeService },
            provideNoopDriver(),
            provideErrorThrowingDriver({ logsBeforeThrowing: 2 }),
          ],
        });
        const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
        fakeTime.setTime(fakeDate);
        const [spyDriver, noopDriver, errorDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as [
          SpyDriver,
          NoopDriver,
          ErrorThrowingDriver
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
        expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog('debug'));

        expect(noopDebugSpy).toHaveBeenCalledTimes(1);
        expect(noopErrorSpy.mock.results[0].type).toBe('throw');
        expect(noopErrorSpy).toHaveBeenCalledTimes(1);

        expect(errorDebugSpy).toHaveBeenCalledTimes(1);
        expect(errorErrorSpy).toHaveBeenCalledTimes(2);
        expect(errorDebugSpy).toHaveBeenCalledWith(createDebugDriverLog('debug'));

        expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      });

      it('logs an error message to stable drivers when a driver fails', () => {
        TestBed.configureTestingModule({
          providers: [
            provideLumberjack({
              format: ({ level }) => level,
            }),
            provideSpyDriver(),
            { provide: LumberjackTimeService, useClass: FakeTimeService },
            provideErrorThrowingDriver(),
          ],
        });
        const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
        fakeTime.setTime(fakeDate);
        const logDrivers = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
        const spyDriver = logDrivers[0] as SpyDriver;

        expect(logDebugMessage).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog('debug'));
        const [actualLastErrorMessage] = spyDriver.logError.mock.calls[
          spyDriver.logError.mock.calls.length - 1
        ] as LumberjackLogDriverLog[];
        expect(actualLastErrorMessage.formattedLog).toMatch(
          new RegExp(`^Could not log message ".*?" to ${ErrorThrowingDriver.name}.\n Error: ".*?"`)
        );
        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });

      it('accepts logs when multiple log drivers are registered', () => {
        TestBed.configureTestingModule({
          providers: [
            provideLumberjack({
              format: ({ level }) => level,
            }),
            provideSpyDriver(),
            { provide: LumberjackTimeService, useClass: FakeTimeService },
            provideErrorThrowingDriver(),
          ],
        });
        const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
        fakeTime.setTime(fakeDate);
        const logDrivers = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
        const spyDriver = logDrivers[0] as SpyDriver;

        expect(logDebugMessage).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog('debug'));
        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });

      it('outputs an error mentioning the log and log driver name recursively', () => {
        TestBed.configureTestingModule({
          providers: [provideLumberjack(), provideSpyDriver(), provideErrorThrowingDriver({ logsBeforeThrowing: 1 })],
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
          new RegExp(`^Could not log message .*?\n.*? to ${ErrorThrowingDriver.name}.\n Error: .*?\n Error: .*?$`)
        );
        const [actualFirstErrorMessage] = consoleErrorSpy.mock.calls[0] as string[];
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
          providers: [
            provideLumberjack({
              format: () => {
                throw new Error('Test format error');
              },
            }),
            provideSpyDriver(),
          ],
        });

        lumberjack = TestBed.inject(LumberjackService) as LumberjackService;

        const [logDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
        spyDriver = logDriver as SpyDriver;
        logFactory = TestBed.inject(LumberjackLogFactory);
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
        providers: [
          provideLumberjack({
            format: ({ level }) => level,
          }),
          provideSpyDriver(),
          { provide: LumberjackTimeService, useClass: FakeTimeService },
        ],
      });
      const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
      fakeTime.setTime(fakeDate);

      lumberjack = TestBed.inject(LumberjackService) as LumberjackService;

      const [logDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
      spyDriver = logDriver as SpyDriver;

      logFactory = TestBed.inject(LumberjackLogFactory);
    });

    let logFactory: LumberjackLogFactory;
    let lumberjack: LumberjackService;
    let spyDriver: SpyDriver;

    it('logs a critical error to a log driver', () => {
      lumberjack.log(logFactory.createCriticalLog('').withScope('Test').build());

      expect(spyDriver.logCritical).toHaveBeenCalledTimes(1);
      expect(spyDriver.logCritical).toHaveBeenCalledWith(createCriticalDriverLog('critical'));
    });

    it('logs a debug message to a log driver', () => {
      lumberjack.log(logFactory.createDebugLog('').withScope('Test').build());

      expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
      expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog('debug'));
    });

    it('logs an error message to a log driver', () => {
      lumberjack.log(logFactory.createErrorLog('').withScope('Test').build());

      expect(spyDriver.logError).toHaveBeenCalledTimes(1);
      expect(spyDriver.logError).toHaveBeenCalledWith(createErrorDriverLog('error'));
    });

    it('logs an info message to a log driver', () => {
      lumberjack.log(logFactory.createInfoLog('').withScope('Test').build());

      expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
      expect(spyDriver.logInfo).toHaveBeenCalledWith(createInfoDriverLog('info'));
    });

    it('logs a trace to a log driver', () => {
      lumberjack.log(logFactory.createTraceLog('').withScope('Test').build());

      expect(spyDriver.logTrace).toHaveBeenCalledTimes(1);
      expect(spyDriver.logTrace).toHaveBeenCalledWith(createTraceDriverLog('trace'));
    });

    it('logs a warning to a log driver', () => {
      lumberjack.log(logFactory.createWarningLog('').withScope('Test').build());

      expect(spyDriver.logWarning).toHaveBeenCalledTimes(1);
      expect(spyDriver.logWarning).toHaveBeenCalledWith(createWarningDriverLog('warn'));
    });
  });

  describe('Log levels', () => {
    it('accepts logs when no log levels are enabled', () => {
      TestBed.configureTestingModule({
        providers: [provideLumberjack(), noLogsProvider],
      });

      expect(logDebugMessage).not.toThrow();
    });

    it('accepts logs when all log levels are enabled', () => {
      TestBed.configureTestingModule({
        providers: [provideLumberjack(), allLogsProvider],
      });

      expect(logDebugMessage).not.toThrow();
    });

    it('accepts logs when all log levels are enabled and a log driver is registered', () => {
      TestBed.configureTestingModule({
        providers: [provideLumberjack(), allLogsProvider, provideNoopDriver()],
      });

      expect(logDebugMessage).not.toThrow();
    });
  });

  describe('Verbose logging', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideLumberjack({
            format: ({ level }) => level,
          }),
          provideSpyDriver(),
          { provide: LumberjackTimeService, useClass: FakeTimeService },
          verboseLoggingProvider,
        ],
      });
      const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
      fakeTime.setTime(fakeDate);

      lumberjack = TestBed.inject(LumberjackService) as LumberjackService;

      const [logDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
      spyDriver = logDriver as SpyDriver;

      logFactory = TestBed.inject(LumberjackLogFactory);
    });

    let logFactory: LumberjackLogFactory;
    let lumberjack: LumberjackService;
    let spyDriver: SpyDriver;

    describe('when a log driver is registered', () => {
      const scope = 'Verbose';

      it('debug logs are logged', () => {
        lumberjack.log(logFactory.createDebugLog('').withScope(scope).build());

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog('debug', undefined, scope));
      });

      it('errors are logged', () => {
        lumberjack.log(logFactory.createErrorLog('').withScope(scope).build());

        expect(spyDriver.logError).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).toHaveBeenCalledWith(createErrorDriverLog('error', undefined, scope));
      });

      it('info is logged', () => {
        lumberjack.log(logFactory.createInfoLog('').withScope(scope).build());

        expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
        expect(spyDriver.logInfo).toHaveBeenCalledWith(createInfoDriverLog('info', undefined, scope));
      });

      it('warnings are logged', () => {
        lumberjack.log(logFactory.createWarningLog('').withScope(scope).build());

        expect(spyDriver.logWarning).toHaveBeenCalledTimes(1);
        expect(spyDriver.logWarning).toHaveBeenCalledWith(createWarningDriverLog('warn', undefined, scope));
      });
    });
  });

  describe('Multiple log drivers', () => {
    describe('given drivers with different log levels', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            provideLumberjack({
              format: ({ level }) => level,
            }),
            provideSpyDriver({
              levels: ['debug', 'info', 'trace'],
              identifier: SpyDriver.name,
            }),
            { provide: LumberjackTimeService, useClass: FakeTimeService },
            verboseLoggingProvider,
            provideNoopDriver({
              levels: ['critical', 'error', 'warn'],
              identifier: NoopDriver.name,
            }),
          ],
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
        logFactory = TestBed.inject(LumberjackLogFactory);
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
        expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog('debug'));
        expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
        expect(spyDriver.logInfo).toHaveBeenCalledWith(createInfoDriverLog('info'));
        expect(spyDriver.logTrace).toHaveBeenCalledTimes(1);
        expect(spyDriver.logTrace).toHaveBeenCalledWith(createTraceDriverLog('trace'));

        expect(noopDriver.logCritical).toHaveBeenCalledTimes(1);
        expect((noopDriver as LumberjackLogDriver).logCritical).toHaveBeenCalledWith(
          createCriticalDriverLog('critical')
        );
        expect(noopDriver.logError).toHaveBeenCalledTimes(1);
        expect((noopDriver as LumberjackLogDriver).logError).toHaveBeenCalledWith(createErrorDriverLog('error'));
        expect(noopDriver.logWarning).toHaveBeenCalledTimes(1);
        expect((noopDriver as LumberjackLogDriver).logWarning).toHaveBeenCalledWith(createWarningDriverLog('warn'));
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

  describe('Extended methods', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideLumberjack({
            format: ({ level }) => level,
          }),
          { provide: LumberjackTimeService, useClass: FakeTimeService },
          provideSpyDriver(),
        ],
      });
      const fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
      fakeTime.setTime(fakeDate);

      lumberjack = TestBed.inject(LumberjackService) as LumberjackService;

      const [logDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
      spyDriver = logDriver as SpyDriver;
    });

    let lumberjack: LumberjackService;
    let spyDriver: SpyDriver;

    it('correctly forwards the critical log', () => {
      const payload = undefined;
      lumberjack.logCritical('', payload, 'scope');

      expect(spyDriver.logCritical).toHaveBeenCalledTimes(1);
      expect(spyDriver.logCritical).toHaveBeenCalledWith(createCriticalDriverLog('critical', payload, 'scope'));
    });

    it('correctly forwards the error log', () => {
      const payload = undefined;
      lumberjack.logError('', payload, 'scope');

      expect(spyDriver.logError).toHaveBeenCalledTimes(1);
      expect(spyDriver.logError).toHaveBeenCalledWith(createErrorDriverLog('error', payload, 'scope'));
    });

    it('correctly forwards the warning log', () => {
      const payload = undefined;
      lumberjack.logWarning('', payload, 'scope');

      expect(spyDriver.logWarning).toHaveBeenCalledTimes(1);
      expect(spyDriver.logWarning).toHaveBeenCalledWith(createWarningDriverLog('warn', payload, 'scope'));
    });

    it('correctly forwards the info log', () => {
      const payload = undefined;
      lumberjack.logInfo('', payload, 'scope');

      expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
      expect(spyDriver.logInfo).toHaveBeenCalledWith(createInfoDriverLog('info', payload, 'scope'));
    });

    it('correctly forwards the debug log', () => {
      const payload = undefined;
      lumberjack.logInfo('', payload, 'scope');

      expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
      expect(spyDriver.logInfo).toHaveBeenCalledWith(createInfoDriverLog('info', payload, 'scope'));
    });

    it('correctly forwards the debug log', () => {
      const payload = undefined;
      lumberjack.logDebug('', payload, 'scope');

      expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
      expect(spyDriver.logDebug).toHaveBeenCalledWith(createDebugDriverLog('debug', payload, 'scope'));
    });

    it('correctly forwards the trace log', () => {
      const payload = undefined;
      lumberjack.logTrace('', payload, 'scope');

      expect(spyDriver.logTrace).toHaveBeenCalledTimes(1);
      expect(spyDriver.logTrace).toHaveBeenCalledWith(createTraceDriverLog('trace', payload, 'scope'));
    });
  });
});
