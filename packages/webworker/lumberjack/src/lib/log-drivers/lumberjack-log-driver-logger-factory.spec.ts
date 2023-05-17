import { createFakeTime, SpyDriver, spyDriverFactory } from '@internal/core/test-util';

import { LumberjackLevel } from '../logs/lumberjack-level';
import { createLumberjackLogFactory, LumberjackLogFactory } from '../logging/create-lumberjack-log-factory';

import { LumberjackLogDriverLogger, lumberjackLogDriverLoggerFactory } from './lumberjack-log-driver-logger-factory';
import { LumberjackLogDriverLog } from './lumberjack-log-driver.log';

describe(lumberjackLogDriverLoggerFactory.name, () => {
  const { getUnixEpochTicks } = createFakeTime();

  beforeEach(() => {
    logDriver = spyDriverFactory({ levels: [LumberjackLevel.Verbose] });
    logger = lumberjackLogDriverLoggerFactory();
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
