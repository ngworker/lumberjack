import { TestBed } from '@angular/core/testing';

import { provideSpyDriver, SpyDriver } from '@internal/test-util';

import { provideLumberjack } from '../configuration/provide-lumberjack';
import { LumberjackLogFactory } from '../logging/lumberjack-log-factory';

import { LumberjackLogDriverLogger } from './lumberjack-log-driver-logger';
import { LumberjackLogDriverLog } from './lumberjack-log-driver.log';
import { lumberjackLogDriverToken } from './lumberjack-log-driver.token';

describe(LumberjackLogDriverLogger.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideLumberjack(), provideSpyDriver()],
    });
    [logDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as [SpyDriver];
    logFactory = TestBed.inject(LumberjackLogFactory);
    logger = TestBed.inject(LumberjackLogDriverLogger);
  });

  let logDriver: SpyDriver;
  let logFactory: LumberjackLogFactory;
  let logger: LumberjackLogDriverLogger;

  it('logs a critical log driver log', () => {
    const logDriverLog: LumberjackLogDriverLog = {
      formattedLog: 'critical',
      log: logFactory.createCriticalLog('critical').build(),
    };

    logger.log(logDriver, logDriverLog);

    expect(logDriver.logCritical).toHaveBeenNthCalledWith(1, logDriverLog);
  });

  it('logs a debug log driver log', () => {
    const logDriverLog: LumberjackLogDriverLog = {
      formattedLog: 'debug',
      log: logFactory.createDebugLog('debug').build(),
    };

    logger.log(logDriver, logDriverLog);

    expect(logDriver.logDebug).toHaveBeenNthCalledWith(1, logDriverLog);
  });

  it('logs an error log driver log', () => {
    const logDriverLog: LumberjackLogDriverLog = {
      formattedLog: 'error',
      log: logFactory.createErrorLog('error').build(),
    };

    logger.log(logDriver, logDriverLog);

    expect(logDriver.logError).toHaveBeenNthCalledWith(1, logDriverLog);
  });

  it('logs an info log driver log', () => {
    const logDriverLog: LumberjackLogDriverLog = {
      formattedLog: 'info',
      log: logFactory.createInfoLog('info').build(),
    };

    logger.log(logDriver, logDriverLog);

    expect(logDriver.logInfo).toHaveBeenNthCalledWith(1, logDriverLog);
  });

  it('logs a trace log driver log', () => {
    const logDriverLog: LumberjackLogDriverLog = {
      formattedLog: 'trace',
      log: logFactory.createTraceLog('trace').build(),
    };

    logger.log(logDriver, logDriverLog);

    expect(logDriver.logTrace).toHaveBeenNthCalledWith(1, logDriverLog);
  });

  it('logs a warning log driver log', () => {
    const logDriverLog: LumberjackLogDriverLog = {
      formattedLog: 'warn',
      log: logFactory.createWarningLog('warn').build(),
    };

    logger.log(logDriver, logDriverLog);

    expect(logDriver.logWarning).toHaveBeenNthCalledWith(1, logDriverLog);
  });
});
