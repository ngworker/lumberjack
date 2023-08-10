import { createFakeTime, createSpyDriver, SpyDriver } from '@internal/core/test-util';

import { createLumberjackLogFactory } from '../logging/create-lumberjack-log-factory';
import { LumberjackLogFactory } from '../logging/lumberjack-log-factory';
import { LumberjackLevel } from '../logs/lumberjack-level';

import { createLumberjackDriverLogger } from './create-lumberjack-driver-logger';
import { LumberjackDriverLog } from './lumberjack-driver.log';
import { LumberjackDriverLogger } from './lumberjack-driver-logger';

describe(createLumberjackDriverLogger.name, () => {
  const { getUnixEpochTicks } = createFakeTime();

  beforeEach(() => {
    driver = createSpyDriver({ levels: [LumberjackLevel.Verbose] });
    logger = createLumberjackDriverLogger();
    logFactory = createLumberjackLogFactory({ getUnixEpochTicks });
  });

  let driver: SpyDriver;
  let logFactory: LumberjackLogFactory;
  let logger: LumberjackDriverLogger;

  it('logs a critical driver log', () => {
    const driverLog: LumberjackDriverLog = {
      formattedLog: LumberjackLevel.Critical,
      log: logFactory.createCriticalLog(LumberjackLevel.Critical).build(),
    };

    logger.log(driver, driverLog);

    expect(driver.logCritical).toHaveBeenNthCalledWith(1, driverLog);
  });

  it('logs a debug driver log', () => {
    const driverLog: LumberjackDriverLog = {
      formattedLog: LumberjackLevel.Debug,
      log: logFactory.createDebugLog(LumberjackLevel.Debug).build(),
    };

    logger.log(driver, driverLog);

    expect(driver.logDebug).toHaveBeenNthCalledWith(1, driverLog);
  });

  it('logs an error driver log', () => {
    const driverLog: LumberjackDriverLog = {
      formattedLog: LumberjackLevel.Error,
      log: logFactory.createErrorLog(LumberjackLevel.Error).build(),
    };

    logger.log(driver, driverLog);

    expect(driver.logError).toHaveBeenNthCalledWith(1, driverLog);
  });

  it('logs an info driver log', () => {
    const driverLog: LumberjackDriverLog = {
      formattedLog: LumberjackLevel.Info,
      log: logFactory.createInfoLog(LumberjackLevel.Info).build(),
    };

    logger.log(driver, driverLog);

    expect(driver.logInfo).toHaveBeenNthCalledWith(1, driverLog);
  });

  it('logs a trace driver log', () => {
    const driverLog: LumberjackDriverLog = {
      formattedLog: LumberjackLevel.Trace,
      log: logFactory.createTraceLog(LumberjackLevel.Trace).build(),
    };

    logger.log(driver, driverLog);

    expect(driver.logTrace).toHaveBeenNthCalledWith(1, driverLog);
  });

  it('logs a warning driver log', () => {
    const driverLog: LumberjackDriverLog = {
      formattedLog: LumberjackLevel.Warning,
      log: logFactory.createWarningLog(LumberjackLevel.Warning).build(),
    };

    logger.log(driver, driverLog);

    expect(driver.logWarning).toHaveBeenNthCalledWith(1, driverLog);
  });
});
