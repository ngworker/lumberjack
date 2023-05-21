import {
  LumberjackLevel,
  LumberjackLogDriver,
  LumberjackLogDriverLog,
  LumberjackLogLevel,
} from '@webworker/lumberjack';

import { createDriverLog } from '../logs';
import { createFakeTime } from '../time/create-fake-time';
import { repeatSideEffect } from '../functions/repeat-side-effect';

import { createErrorThrowingDriver, errorThrowingDriverIdentifier } from './create-error-throwing-driver';
import { defaultErrorThrowingDriverOptions } from './default-error-throwing-driver-options';

describe(createErrorThrowingDriver.name, () => {
  function setup(logsBeforeThrowing?: number) {
    const driver = createErrorThrowingDriver({
      logsBeforeThrowing: logsBeforeThrowing ?? defaultErrorThrowingDriverOptions.logsBeforeThrowing,
      levels: [LumberjackLevel.Verbose],
      identifier: errorThrowingDriverIdentifier,
    });

    const fakeTime = createFakeTime();

    return {
      driver,
      fakeTime,
    };
  }

  describe.each([
    [LumberjackLevel.Critical, (driver) => driver.logCritical],
    [LumberjackLevel.Debug, (driver) => driver.logDebug],
    [LumberjackLevel.Error, (driver) => driver.logError],
    [LumberjackLevel.Info, (driver) => driver.logInfo],
    [LumberjackLevel.Trace, (driver) => driver.logTrace],
    [LumberjackLevel.Warning, (driver) => driver.logWarning],
  ] as ReadonlyArray<[LumberjackLogLevel, (driver: LumberjackLogDriver) => (driverLog: LumberjackLogDriverLog) => void]>)(
    `implements a spy when using the %s log level`,
    (logLevel, logMethod) => {
      it('throws an error on first log when the default log driver configuration is used', () => {
        const { driver, fakeTime } = setup();
        const driverLog = createDriverLog(
          fakeTime.getUnixEpochTicks,
          logLevel,
          logLevel,
          '',
          'ErrorThrowingDriverDefaultTest'
        );

        expect(() => logMethod(driver).call(driver, driverLog)).toThrowError();
      });

      describe.each([0, 1, 2, 3])(
        'when the driver is configured to throw an error after %i logs',
        (logsBeforeThrowing) => {
          it('throws an error', () => {
            const { driver, fakeTime } = setup(logsBeforeThrowing);
            const driverLog = createDriverLog(
              fakeTime.getUnixEpochTicks,
              logLevel,
              logLevel,
              '',
              'ErrorThrowingDriverOptionsTest'
            );
            const act = () => logMethod(driver).call(driver, driverLog);
            repeatSideEffect(logsBeforeThrowing, act);

            expect(act).toThrowError();
          });
        }
      );
    }
  );
});
