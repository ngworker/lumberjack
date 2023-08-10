import { createFakeTime, createSpyDriver, SpyDriver } from '@internal/core/test-util';

import { LumberjackLevel } from '../logs/lumberjack-level';
import { createCriticalLogBuilder } from '../logging/create-lumberjack-log-builder-functions/create-critical-log-builder';
import { createDebugLogBuilder } from '../logging/create-lumberjack-log-builder-functions/create-debug-log-builder';
import { createErrorLogBuilder } from '../logging/create-lumberjack-log-builder-functions/create-error-log-builder';
import { createInfoLogBuilder } from '../logging/create-lumberjack-log-builder-functions/create-info-log-builder';
import { createTraceLogBuilder } from '../logging/create-lumberjack-log-builder-functions/create-trace-log-builder';
import { createWarningLogBuilder } from '../logging/create-lumberjack-log-builder-functions/create-warning-log-builder';

import { createLumberjackDriverLogger } from './create-lumberjack-driver-logger';
import { LumberjackDriverLog } from './lumberjack-driver.log';
import { LumberjackDriverLogger } from './lumberjack-driver-logger';

describe(createLumberjackDriverLogger.name, () => {
  const { getUnixEpochTicks } = createFakeTime();

  beforeEach(() => {
    driver = createSpyDriver({ levels: [LumberjackLevel.Verbose] });
    logger = createLumberjackDriverLogger();
  });

  let driver: SpyDriver;
  let logger: LumberjackDriverLogger;

  it('logs a critical driver log', () => {
    const driverLog: LumberjackDriverLog = {
      formattedLog: LumberjackLevel.Critical,
      log: createCriticalLogBuilder(getUnixEpochTicks)(LumberjackLevel.Critical).build(),
    };

    logger.log(driver, driverLog);

    expect(driver.logCritical).toHaveBeenNthCalledWith(1, driverLog);
  });

  it('logs a debug driver log', () => {
    const driverLog: LumberjackDriverLog = {
      formattedLog: LumberjackLevel.Debug,
      log: createDebugLogBuilder(getUnixEpochTicks)(LumberjackLevel.Debug).build(),
    };

    logger.log(driver, driverLog);

    expect(driver.logDebug).toHaveBeenNthCalledWith(1, driverLog);
  });

  it('logs an error driver log', () => {
    const driverLog: LumberjackDriverLog = {
      formattedLog: LumberjackLevel.Error,
      log: createErrorLogBuilder(getUnixEpochTicks)(LumberjackLevel.Error).build(),
    };

    logger.log(driver, driverLog);

    expect(driver.logError).toHaveBeenNthCalledWith(1, driverLog);
  });

  it('logs an info driver log', () => {
    const driverLog: LumberjackDriverLog = {
      formattedLog: LumberjackLevel.Info,
      log: createInfoLogBuilder(getUnixEpochTicks)(LumberjackLevel.Info).build(),
    };

    logger.log(driver, driverLog);

    expect(driver.logInfo).toHaveBeenNthCalledWith(1, driverLog);
  });

  it('logs a trace driver log', () => {
    const driverLog: LumberjackDriverLog = {
      formattedLog: LumberjackLevel.Trace,
      log: createTraceLogBuilder(getUnixEpochTicks)(LumberjackLevel.Trace).build(),
    };

    logger.log(driver, driverLog);

    expect(driver.logTrace).toHaveBeenNthCalledWith(1, driverLog);
  });

  it('logs a warning driver log', () => {
    const driverLog: LumberjackDriverLog = {
      formattedLog: LumberjackLevel.Warning,
      log: createWarningLogBuilder(getUnixEpochTicks)(LumberjackLevel.Warning).build(),
    };

    logger.log(driver, driverLog);

    expect(driver.logWarning).toHaveBeenNthCalledWith(1, driverLog);
  });
});
