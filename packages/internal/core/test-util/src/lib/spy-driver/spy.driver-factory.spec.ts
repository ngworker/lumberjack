import {
  LumberjackLevel,
  LumberjackLogDriver,
  LumberjackLogDriverLog,
  LumberjackLogLevel,
} from '@webworker/lumberjack';

import { createDriverLog } from '../logs';
import { createFakeTime } from '../time/create-fake-time';

import { SpyDriver, spyDriverFactory } from './spy.driver-factory';

describe(spyDriverFactory.name, () => {
  let spyDriver: SpyDriver;
  const fakeTime = createFakeTime();

  beforeEach(() => {
    spyDriver = spyDriverFactory({ levels: [LumberjackLevel.Verbose] });
  });

  describe.each([
    [LumberjackLevel.Critical, (driver) => driver.logCritical],
    [LumberjackLevel.Debug, (driver) => driver.logDebug],
    [LumberjackLevel.Error, (driver) => driver.logError],
    [LumberjackLevel.Info, (driver) => driver.logInfo],
    [LumberjackLevel.Trace, (driver) => driver.logTrace],
    [LumberjackLevel.Warning, (driver) => driver.logWarning],
  ] as ReadonlyArray<[LumberjackLogLevel, (driver: LumberjackLogDriver<void>) => (driverLog: LumberjackLogDriverLog<void>) => void]>)(
    `implements a spy when using the %s log level`,
    (logLevel, logMethod) => {
      it('records calls', () => {
        const driverLog = createDriverLog<void>(fakeTime.getUnixEpochTicks, logLevel, logLevel, '', 'SpyDriverTest');
        const logSpy = logMethod(spyDriver) as jest.Mock<void, [LumberjackLogDriverLog<void>]>;

        logSpy.call(spyDriver, driverLog);

        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith(driverLog);
      });

      it('resets the spy', () => {
        const driverLog = createDriverLog<void>(fakeTime.getUnixEpochTicks, logLevel, logLevel, '', 'SpyDriverTest');
        const logSpy = logMethod(spyDriver) as jest.Mock<void, [LumberjackLogDriverLog<void>]>;
        logSpy.call(spyDriver, driverLog);

        spyDriver.reset();

        expect(logSpy).toHaveBeenCalledTimes(0);
      });
    }
  );
});
