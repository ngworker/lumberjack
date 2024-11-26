import { TestBed } from '@angular/core/testing';

import {
  LumberjackLogDriver,
  LumberjackLogDriverLog,
  lumberjackLogDriverToken,
  LumberjackLogLevel,
  provideLumberjack,
} from '@ngworker/lumberjack';

import { repeatSideEffect } from '../functions/repeat-side-effect';
import { createDriverLog } from '../logs/driver-log-creators';

import { ErrorThrowingDriver } from './error-throwing.driver';
import { provideErrorThrowingDriver } from './provide-error-throwing-driver';

describe(ErrorThrowingDriver.name, () => {
  function setup(logsBeforeThrowing?: number) {
    TestBed.configureTestingModule({
      providers: [
        provideLumberjack(),
        provideErrorThrowingDriver(logsBeforeThrowing != null ? { logsBeforeThrowing } : undefined),
      ],
    });

    const [driver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];

    return {
      driver,
    };
  }

  describe.each([
    ['critical', (driver) => driver.logCritical],
    ['debug', (driver) => driver.logDebug],
    ['error', (driver) => driver.logError],
    ['info', (driver) => driver.logInfo],
    ['trace', (driver) => driver.logTrace],
    ['warn', (driver) => driver.logWarning],
  ] as ReadonlyArray<[LumberjackLogLevel, (driver: LumberjackLogDriver) => (driverLog: LumberjackLogDriverLog) => void]>)(
    `implements a spy when using the %s log level`,
    (logLevel, logMethod) => {
      it('throws an error on first log when the default log driver configuration is used', () => {
        const { driver } = setup();
        const driverLog = createDriverLog(logLevel, logLevel, '', 'ErrorThrowingDriverDefaultTest');

        expect(() => logMethod(driver).call(driver, driverLog)).toThrow();
      });

      describe.each([0, 1, 2, 3])(
        'when the driver is configured to throw an error after %i logs',
        (logsBeforeThrowing) => {
          it('throws an error', () => {
            const { driver } = setup(logsBeforeThrowing);
            const driverLog = createDriverLog(logLevel, logLevel, '', 'ErrorThrowingDriverOptionsTest');
            const act = () => logMethod(driver).call(driver, driverLog);
            repeatSideEffect(logsBeforeThrowing, act);

            expect(act).toThrow();
          });
        }
      );
    }
  );
});
