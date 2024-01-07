import { TestBed } from '@angular/core/testing';

import {
  LumberjackLevel,
  LumberjackLogDriver,
  LumberjackLogDriverLog,
  lumberjackLogDriverToken,
  LumberjackLogLevel,
  LumberjackModule,
} from '@ngworker/lumberjack';

import { repeatSideEffect } from '../functions/repeat-side-effect';
import { createDriverLog } from '../logs/driver-log-creators';

import { ErrorThrowingDriver } from './error-throwing.driver';
import { provideErrorThrowingDriver, withErrorThrowingOptions } from './provide-error-throwing-driver';

describe(ErrorThrowingDriver.name, () => {
  function setup(logsBeforeThrowing?: number) {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot()],
      providers: [
        provideErrorThrowingDriver(
          logsBeforeThrowing != null ? withErrorThrowingOptions({ logsBeforeThrowing }) : withErrorThrowingOptions()
        ),
      ],
    });

    const [driver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];

    return {
      driver,
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
        const { driver } = setup();
        const driverLog = createDriverLog(logLevel, logLevel, '', 'ErrorThrowingDriverDefaultTest');

        expect(() => logMethod(driver).call(driver, driverLog)).toThrowError();
      });

      describe.each([0, 1, 2, 3])(
        'when the driver is configured to throw an error after %i logs',
        (logsBeforeThrowing) => {
          it('throws an error', () => {
            const { driver } = setup(logsBeforeThrowing);
            const driverLog = createDriverLog(logLevel, logLevel, '', 'ErrorThrowingDriverOptionsTest');
            const act = () => logMethod(driver).call(driver, driverLog);
            repeatSideEffect(logsBeforeThrowing, act);

            expect(act).toThrowError();
          });
        }
      );
    }
  );
});
