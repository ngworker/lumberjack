import { createFakeTime, createSpyDriver, SpyDriver } from '@internal/core/test-util';

import { createLumberjackLogFactory } from '../logging/create-lumberjack-log-factory';
import { LumberjackLogFactory } from '../logging/lumberjack-log-factory';
import { LumberjackLevel } from '../logs/lumberjack-level';

import { createLumberjackLogDriverLogger } from './create-lumberjack-log-driver-logger';
import { LumberjackLogDriverLog } from './lumberjack-log-driver.log';
import { LumberjackLogDriverLogger } from './lumberjack-log-driver-logger';

describe(createLumberjackLogDriverLogger.name, () => {
  const { getUnixEpochTicks } = createFakeTime();

  beforeEach(() => {
    logDriver = createSpyDriver({ levels: [LumberjackLevel.Verbose] });
    logger = createLumberjackLogDriverLogger();
    logFactory = createLumberjackLogFactory({ getUnixEpochTicks });
  });

  let logDriver: SpyDriver;
  let logFactory: LumberjackLogFactory;
  let logger: LumberjackLogDriverLogger;

  it('logs a critical log driver log', () => {
    const logDriverLog: LumberjackLogDriverLog = {
      formattedLog: LumberjackLevel.Critical,
      log: logFactory.createCriticalLog(LumberjackLevel.Critical).build(),
    };

    logger.log(logDriver, logDriverLog);

    expect(logDriver.logCritical).toHaveBeenNthCalledWith(1, logDriverLog);
  });

  it('logs a debug log driver log', () => {
    const logDriverLog: LumberjackLogDriverLog = {
      formattedLog: LumberjackLevel.Debug,
      log: logFactory.createDebugLog(LumberjackLevel.Debug).build(),
    };

    logger.log(logDriver, logDriverLog);

    expect(logDriver.logDebug).toHaveBeenNthCalledWith(1, logDriverLog);
  });

  it('logs an error log driver log', () => {
    const logDriverLog: LumberjackLogDriverLog = {
      formattedLog: LumberjackLevel.Error,
      log: logFactory.createErrorLog(LumberjackLevel.Error).build(),
    };

    logger.log(logDriver, logDriverLog);

    expect(logDriver.logError).toHaveBeenNthCalledWith(1, logDriverLog);
  });

  it('logs an info log driver log', () => {
    const logDriverLog: LumberjackLogDriverLog = {
      formattedLog: LumberjackLevel.Info,
      log: logFactory.createInfoLog(LumberjackLevel.Info).build(),
    };

    logger.log(logDriver, logDriverLog);

    expect(logDriver.logInfo).toHaveBeenNthCalledWith(1, logDriverLog);
  });

  it('logs a trace log driver log', () => {
    const logDriverLog: LumberjackLogDriverLog = {
      formattedLog: LumberjackLevel.Trace,
      log: logFactory.createTraceLog(LumberjackLevel.Trace).build(),
    };

    logger.log(logDriver, logDriverLog);

    expect(logDriver.logTrace).toHaveBeenNthCalledWith(1, logDriverLog);
  });

  it('logs a warning log driver log', () => {
    const logDriverLog: LumberjackLogDriverLog = {
      formattedLog: LumberjackLevel.Warning,
      log: logFactory.createWarningLog(LumberjackLevel.Warning).build(),
    };

    logger.log(logDriver, logDriverLog);

    expect(logDriver.logWarning).toHaveBeenNthCalledWith(1, logDriverLog);
  });
});
