import { LumberjackLevel, LumberjackDriverLog, LumberjackLogLevel } from '@lumberjackjs/core';

import { createDriverLog } from '../logs';
import { createFakeTime } from '../time/create-fake-time';

import { ObjectPayload } from './object.payload';
import { createObjectDriver, ObjectDriver, objectDriverIdentifier } from './create-object-driver';
import { createObjectLogger, ObjectLogger } from './object-logger';
import { ObjectDriverConfig } from './object-driver.config';

describe(createObjectDriver.name, () => {
  let objectDriver: ObjectDriver;
  let objectLogger: ObjectLogger;
  const fakeTime = createFakeTime();
  const config: ObjectDriverConfig = { levels: [LumberjackLevel.Verbose], identifier: objectDriverIdentifier };

  beforeEach(() => {
    objectLogger = createObjectLogger();
    objectDriver = createObjectDriver(config, objectLogger);
    jest.spyOn(objectLogger, 'log');
  });

  describe.each([
    [LumberjackLevel.Critical, (driver) => driver.logCritical, { isWorking: true }],
    [LumberjackLevel.Debug, (driver) => driver.logDebug, { isWorking: false }],
    [LumberjackLevel.Error, (driver) => driver.logError, undefined],
    [LumberjackLevel.Info, (driver) => driver.logInfo, { isWorking: true }],
    [LumberjackLevel.Trace, (driver) => driver.logTrace, { isWorking: false }],
    [LumberjackLevel.Warning, (driver) => driver.logWarning, undefined],
  ] as ReadonlyArray<[LumberjackLogLevel, (driver: ObjectDriver) => (driverLog: LumberjackDriverLog<ObjectPayload>) => void, ObjectPayload | undefined]>)(
    `delegates to ${createObjectLogger.name} when using the %s log level`,
    (logLevel, logMethod, expectedPayload) => {
      it(`forwards the log payload to the ObjectLogger->log method`, () => {
        const driverLog = createDriverLog<ObjectPayload>(
          fakeTime.getUnixEpochTicks,
          logLevel,
          logLevel,
          '',
          'ObjectDriverTest',
          expectedPayload
        );

        logMethod(objectDriver).call(objectDriver, driverLog);

        expect(objectLogger.log).toHaveBeenCalledWith(expectedPayload);
      });
    }
  );
});
