import {
  createCriticalDriverLog,
  createDebugDriverLog,
  createErrorDriverLog,
  createErrorThrowingDriver,
  createFakeTime,
  createInfoDriverLog,
  createNoopDriver,
  createObjectDriver,
  createObjectLogger,
  createSpyDriver,
  createTraceDriverLog,
  createWarningDriverLog,
  defaultErrorThrowingDriverOptions,
  errorThrowingDriverIdentifier,
  NoopDriver,
  noopDriverIdentifier,
  ObjectPayload,
  SpyDriver,
  spyDriverIdentifier,
} from '@internal/core/test-util';

import { createLumberjackConfig } from '../configuration/create-lumberjack-config';
import { LumberjackDriverConfig } from '../configuration/lumberjack-driver.config';
import { LumberjackOptions } from '../configuration/lumberjack.options';
import { LumberjackDriver } from '../drivers/lumberjack-driver';
import { LumberjackDriverLog } from '../drivers/lumberjack-driver.log';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { createLumberjack } from './create-lumberjack';
import { createCriticalLogBuilder } from './create-lumberjack-log-builder-functions/create-critical-log-builder';
import { createDebugLogBuilder } from './create-lumberjack-log-builder-functions/create-debug-log-builder';
import { createErrorLogBuilder } from './create-lumberjack-log-builder-functions/create-error-log-builder';
import { createInfoLogBuilder } from './create-lumberjack-log-builder-functions/create-info-log-builder';
import { createTraceLogBuilder } from './create-lumberjack-log-builder-functions/create-trace-log-builder';
import { createWarningLogBuilder } from './create-lumberjack-log-builder-functions/create-warning-log-builder';
import { Lumberjack } from './lumberjack';

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

const noLogsConfig: Omit<LumberjackDriverConfig, 'identifier'> = {
  levels: [],
};
const allLogsConfig: Omit<LumberjackDriverConfig, 'identifier'> = {
  levels: [
    LumberjackLevel.Critical,
    LumberjackLevel.Debug,
    LumberjackLevel.Error,
    LumberjackLevel.Info,
    LumberjackLevel.Trace,
    LumberjackLevel.Warning,
  ],
};
const verboseLoggingConfig: Omit<LumberjackDriverConfig, 'identifier'> = {
  levels: [LumberjackLevel.Verbose],
};
const fakeDate = new Date('2020-02-02T02:02:02.000Z');
const fakeTime = createFakeTime();
fakeTime.setTime(fakeDate);

interface PayloadFieldInfo extends LumberjackLogPayload {
  payloadInfo: string;
}

const payloadInfo: PayloadFieldInfo = { payloadInfo: 'PayloadINFO' };
const objectPayloadInfo: ObjectPayload = { isWorking: true };

const logDebugMessage = (lumberjack: Lumberjack) =>
  lumberjack.log(createDebugLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope('Test').build());
const logDebugMessageWithPayloadField = (lumberjack: Lumberjack<PayloadFieldInfo>) =>
  lumberjack.log(
    createDebugLogBuilder<PayloadFieldInfo>(fakeTime.getUnixEpochTicks.bind(fakeTime))('')
      .withScope('Test')
      .withPayload(payloadInfo)
      .build()
  );
const logDebugMessageWithObjectPayloadField = (lumberjack: Lumberjack<ObjectPayload>) =>
  lumberjack.log(
    createDebugLogBuilder<ObjectPayload>(fakeTime.getUnixEpochTicks.bind(fakeTime))('')
      .withScope('Test')
      .withPayload(objectPayloadInfo)
      .build()
  );

function createTestLumberjack<TPayload extends LumberjackLogPayload | void>(
  drivers: LumberjackDriver<TPayload>[],
  options?: LumberjackOptions
): Lumberjack<TPayload> {
  return createLumberjack({
    drivers,
    getUnixEpochTicks: fakeTime.getUnixEpochTicks,
    config: createLumberjackConfig(false, options),
  });
}

describe(createLumberjack.name, () => {
  const lumberjack = createTestLumberjack([]);

  describe('Drivers', () => {
    it('accepts logs when no drivers are registered', () => {
      expect(() => logDebugMessage(lumberjack)).not.toThrow();
    });

    it('accepts logs when a single driver is registered', () => {
      const lumberjack = createTestLumberjack([createNoopDriver(verboseLoggingConfig)]);
      expect(() => logDebugMessage(lumberjack)).not.toThrow();
    });

    it('accepts logs when multiple drivers are registered', () => {
      const lumberjack = createTestLumberjack([
        createNoopDriver(verboseLoggingConfig),
        createSpyDriver(verboseLoggingConfig),
      ]);
      expect(() => logDebugMessage(lumberjack)).not.toThrow();
    });

    describe('Drivers with custom lumberjack logs', () => {
      it('receives the payload parameter in the provided driver', () => {
        const spyDriver = createSpyDriver<PayloadFieldInfo>(verboseLoggingConfig);
        const lumberjack = createTestLumberjack<PayloadFieldInfo>([spyDriver]);
        fakeTime.setTime(fakeDate);

        expect(() => logDebugMessageWithPayloadField(lumberjack)).not.toThrow();

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
        const objectLogger = createObjectLogger();
        const lumberjack = createTestLumberjack<ObjectPayload>([
          createObjectDriver(verboseLoggingConfig, objectLogger) as LumberjackDriver<ObjectPayload>,
        ]);

        const objectLogSpy = jest.spyOn(objectLogger, 'log');

        expect(() => logDebugMessageWithObjectPayloadField(lumberjack)).not.toThrow();

        expect(objectLogSpy).toHaveBeenCalledWith(objectPayloadInfo);
      });
    });

    describe('Error-throwing drivers', () => {
      beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
          /* do nothing */
        });
      });

      let consoleErrorSpy: jest.SpyInstance<void, unknown[]>;

      it('outputs an error when a single driver is registered', () => {
        const lumberjack = createTestLumberjack([
          createErrorThrowingDriver({
            logsBeforeThrowing: defaultErrorThrowingDriverOptions.logsBeforeThrowing,
            levels: [LumberjackLevel.Verbose],
            identifier: errorThrowingDriverIdentifier,
          }) as LumberjackDriver,
        ]);

        expect(() => logDebugMessage(lumberjack)).not.toThrow();

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      });

      it('outputs errors when multiple drivers are registered and last green driver fails while logging errors', () => {
        const errorDriver = createErrorThrowingDriver({
          logsBeforeThrowing: 1,
          levels: [LumberjackLevel.Verbose],
          identifier: errorThrowingDriverIdentifier,
        }) as LumberjackDriver;
        const spyDriver = createSpyDriver(verboseLoggingConfig);

        const lumberjack = createTestLumberjack([errorDriver, spyDriver], { format: ({ level }) => level });

        fakeTime.setTime(fakeDate);
        spyDriver.logDebug.mockImplementation(() => {
          throw new SpyDriverError();
        });
        const errorDebugSpy = jest.spyOn(errorDriver, 'logDebug');
        const errorErrorSpy = jest.spyOn(errorDriver, 'logError');

        expect(() => logDebugMessage(lumberjack)).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).not.toHaveBeenCalled();
        expect(spyDriver.logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(fakeTime.getUnixEpochTicks, LumberjackLevel.Debug)
        );

        expect(errorDebugSpy).toHaveBeenCalledTimes(1);
        expect(errorErrorSpy).toHaveBeenCalledTimes(1);
        expect(errorDebugSpy).toHaveBeenCalledWith(
          createDebugDriverLog(fakeTime.getUnixEpochTicks, LumberjackLevel.Debug)
        );

        expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      });

      it('outputs only unprocessed driver errors', () => {
        const noopDriver = createNoopDriver(verboseLoggingConfig);
        const errorDriver = createErrorThrowingDriver({
          logsBeforeThrowing: 2,
          levels: [LumberjackLevel.Verbose],
          identifier: errorThrowingDriverIdentifier,
        }) as LumberjackDriver;
        const spyDriver = createSpyDriver(verboseLoggingConfig);

        const lumberjack = createTestLumberjack([errorDriver, noopDriver, spyDriver], { format: ({ level }) => level });
        fakeTime.setTime(fakeDate);
        spyDriver.logDebug.mockImplementation(() => {
          throw new SpyDriverError();
        });
        const errorDebugSpy = jest.spyOn(errorDriver, 'logDebug');
        const errorErrorSpy = jest.spyOn(errorDriver, 'logError');
        const noopErrorSpy = jest.spyOn(noopDriver, 'logError').mockImplementation(() => {
          throw new Error('Noop is really an error');
        });
        const noopDebugSpy = jest.spyOn(noopDriver, 'logDebug');

        expect(() => logDebugMessage(lumberjack)).not.toThrow();

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
        const errorDriver = createErrorThrowingDriver({
          logsBeforeThrowing: 0,
          levels: [LumberjackLevel.Verbose],
          identifier: errorThrowingDriverIdentifier,
        }) as LumberjackDriver;
        const spyDriver = createSpyDriver(verboseLoggingConfig);

        const lumberjack = createTestLumberjack([errorDriver, spyDriver], { format: ({ level }) => level });
        fakeTime.setTime(fakeDate);

        expect(() => logDebugMessage(lumberjack)).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Debug)
        );
        const [actualLastErrorMessage] = spyDriver.logError.mock.calls[
          spyDriver.logError.mock.calls.length - 1
        ] as LumberjackDriverLog[];
        expect(actualLastErrorMessage.formattedLog).toMatch(
          new RegExp(`^Could not log message ".*?" to ${errorThrowingDriverIdentifier}.\n Error: ".*?"`)
        );
        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });

      it('accepts logs when multiple drivers are registered', () => {
        const errorDriver = createErrorThrowingDriver({
          logsBeforeThrowing: 0,
          levels: [LumberjackLevel.Verbose],
          identifier: errorThrowingDriverIdentifier,
        }) as LumberjackDriver;
        const spyDriver = createSpyDriver(verboseLoggingConfig);

        const lumberjack = createTestLumberjack([errorDriver, spyDriver], { format: ({ level }) => level });

        fakeTime.setTime(fakeDate);

        expect(() => logDebugMessage(lumberjack)).not.toThrow();

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Debug)
        );
        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });

      it('outputs an error mentioning the log and driver name recursively', () => {
        const errorDriver = createErrorThrowingDriver({
          logsBeforeThrowing: 1,
          levels: [LumberjackLevel.Verbose],
          identifier: errorThrowingDriverIdentifier,
        }) as LumberjackDriver;
        const spyDriver = createSpyDriver({ ...verboseLoggingConfig, identifier: spyDriverIdentifier });

        const lumberjack = createTestLumberjack([errorDriver, spyDriver], { format: ({ level }) => level });

        spyDriver.logDebug.mockImplementation(() => {
          throw new SpyDriverError();
        });
        jest.spyOn(errorDriver, 'logDebug');
        jest.spyOn(errorDriver, 'logError');

        logDebugMessage(lumberjack);

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
        spyDriver = createSpyDriver(verboseLoggingConfig);

        lumberjack = createTestLumberjack([spyDriver], {
          format: () => {
            throw new Error('Test format error');
          },
        });
      });

      let lumberjack: Lumberjack;
      let spyDriver: SpyDriver;

      it('logs an error to a driver', () => {
        lumberjack.log(createCriticalLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').build());

        expect(spyDriver.logError).toHaveBeenCalledTimes(1);
      });

      it('does not log a critical error to a driver', () => {
        lumberjack.log(createCriticalLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').build());

        expect(spyDriver.logCritical).not.toHaveBeenCalled();
      });

      it('does not log a debug message to a driver', () => {
        lumberjack.log(createDebugLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').build());

        expect(spyDriver.logDebug).not.toHaveBeenCalled();
      });

      it('does not log an info message to a driver', () => {
        lumberjack.log(createInfoLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').build());

        expect(spyDriver.logInfo).not.toHaveBeenCalled();
      });

      it('does not log a trace to a driver', () => {
        lumberjack.log(createTraceLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').build());

        expect(spyDriver.logTrace).not.toHaveBeenCalled();
      });

      it('does not log a warning to a driver', () => {
        lumberjack.log(createWarningLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').build());

        expect(spyDriver.logWarning).not.toHaveBeenCalled();
      });
    });
  });

  describe('Log types', () => {
    beforeEach(() => {
      spyDriver = createSpyDriver(verboseLoggingConfig);

      lumberjack = createTestLumberjack([spyDriver], {
        format: ({ level }) => level,
      });
      fakeTime.setTime(fakeDate);
    });

    let lumberjack: Lumberjack;
    let spyDriver: SpyDriver;

    it('logs a critical error to a driver', () => {
      lumberjack.log(createCriticalLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope('Test').build());

      expect(spyDriver.logCritical).toHaveBeenCalledTimes(1);
      expect(spyDriver.logCritical).toHaveBeenCalledWith(
        createCriticalDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Critical)
      );
    });

    it('logs a debug message to a driver', () => {
      lumberjack.log(createDebugLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope('Test').build());

      expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
      expect(spyDriver.logDebug).toHaveBeenCalledWith(
        createDebugDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Debug)
      );
    });

    it('logs an error message to a driver', () => {
      lumberjack.log(createErrorLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope('Test').build());

      expect(spyDriver.logError).toHaveBeenCalledTimes(1);
      expect(spyDriver.logError).toHaveBeenCalledWith(
        createErrorDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Error)
      );
    });

    it('logs an info message to a driver', () => {
      lumberjack.log(createInfoLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope('Test').build());

      expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
      expect(spyDriver.logInfo).toHaveBeenCalledWith(
        createInfoDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Info)
      );
    });

    it('logs a trace to a driver', () => {
      lumberjack.log(createTraceLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope('Test').build());

      expect(spyDriver.logTrace).toHaveBeenCalledTimes(1);
      expect(spyDriver.logTrace).toHaveBeenCalledWith(
        createTraceDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Trace)
      );
    });

    it('logs a warning to a driver', () => {
      lumberjack.log(createWarningLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope('Test').build());

      expect(spyDriver.logWarning).toHaveBeenCalledTimes(1);
      expect(spyDriver.logWarning).toHaveBeenCalledWith(
        createWarningDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Warning)
      );
    });
  });

  describe('Log levels', () => {
    it('accepts logs when no log levels are enabled', () => {
      const lumberjack = createTestLumberjack([], noLogsConfig);

      expect(() => logDebugMessage(lumberjack)).not.toThrow();
    });

    it('accepts logs when all log levels are enabled', () => {
      const lumberjack = createTestLumberjack([], allLogsConfig);

      expect(() => logDebugMessage(lumberjack)).not.toThrow();
    });

    it('accepts logs when all log levels are enabled and a driver is registered', () => {
      const noopDriver = createNoopDriver(allLogsConfig);
      const lumberjack = createTestLumberjack([noopDriver]);

      expect(() => logDebugMessage(lumberjack)).not.toThrow();
    });
  });

  describe('Verbose logging', () => {
    beforeEach(() => {
      spyDriver = createSpyDriver(verboseLoggingConfig);

      lumberjack = createTestLumberjack([spyDriver], {
        format: ({ level }) => level,
      });

      fakeTime.setTime(fakeDate);
    });

    let lumberjack: Lumberjack;
    let spyDriver: SpyDriver;

    describe('', () => {
      const scope = 'Verbose';

      it('debug logs are logged', () => {
        lumberjack.log(createDebugLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope(scope).build());

        expect(spyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(spyDriver.logDebug).toHaveBeenCalledWith(
          createDebugDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Debug, undefined, scope)
        );
      });

      it('errors are logged', () => {
        lumberjack.log(createErrorLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope(scope).build());

        expect(spyDriver.logError).toHaveBeenCalledTimes(1);
        expect(spyDriver.logError).toHaveBeenCalledWith(
          createErrorDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Error, undefined, scope)
        );
      });

      it('info is logged', () => {
        lumberjack.log(createInfoLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope(scope).build());

        expect(spyDriver.logInfo).toHaveBeenCalledTimes(1);
        expect(spyDriver.logInfo).toHaveBeenCalledWith(
          createInfoDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Info, undefined, scope)
        );
      });

      it('warnings are logged', () => {
        lumberjack.log(createWarningLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope(scope).build());

        expect(spyDriver.logWarning).toHaveBeenCalledTimes(1);
        expect(spyDriver.logWarning).toHaveBeenCalledWith(
          createWarningDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Warning, undefined, scope)
        );
      });
    });
  });

  describe('Multiple drivers', () => {
    describe('given drivers with different log levels', () => {
      beforeEach(() => {
        spyDriver = createSpyDriver({
          levels: [LumberjackLevel.Debug, LumberjackLevel.Info, LumberjackLevel.Trace],
          identifier: spyDriverIdentifier,
        });

        noopDriver = createNoopDriver({
          levels: [LumberjackLevel.Critical, LumberjackLevel.Error, LumberjackLevel.Warning],
          identifier: noopDriverIdentifier,
        }) as jest.Mocked<NoopDriver>;

        lumberjack = createTestLumberjack([spyDriver, noopDriver], {
          format: ({ level }) => level,
        });

        fakeTime.setTime(fakeDate);

        jest.spyOn(noopDriver, 'logCritical');
        jest.spyOn(noopDriver, 'logDebug');
        jest.spyOn(noopDriver, 'logError');
        jest.spyOn(noopDriver, 'logInfo');
        jest.spyOn(noopDriver, 'logTrace');
        jest.spyOn(noopDriver, 'logWarning');
      });

      beforeEach(() => {
        lumberjack.log(
          createCriticalLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope('Test').build()
        );
        lumberjack.log(createDebugLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope('Test').build());
        lumberjack.log(createErrorLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope('Test').build());
        lumberjack.log(createInfoLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope('Test').build());
        lumberjack.log(createTraceLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope('Test').build());
        lumberjack.log(
          createWarningLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('').withScope('Test').build()
        );
      });

      let lumberjack: Lumberjack;
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
        expect((noopDriver as LumberjackDriver).logCritical).toHaveBeenCalledWith(
          createCriticalDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Critical)
        );
        expect(noopDriver.logError).toHaveBeenCalledTimes(1);
        expect((noopDriver as LumberjackDriver).logError).toHaveBeenCalledWith(
          createErrorDriverLog(fakeTime.getUnixEpochTicks.bind(fakeTime), LumberjackLevel.Error)
        );
        expect(noopDriver.logWarning).toHaveBeenCalledTimes(1);
        expect((noopDriver as LumberjackDriver).logWarning).toHaveBeenCalledWith(
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
