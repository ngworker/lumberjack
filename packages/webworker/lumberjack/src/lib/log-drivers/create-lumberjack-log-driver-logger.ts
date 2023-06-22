import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { LogDriverLoggingStrategy } from './log-driver-logging-strategy';
import { criticalLogDriverLoggingStrategy } from './logging-strategies/critical-log-driver-logging-strategy';
import { debugLogDriverLoggingStrategy } from './logging-strategies/debug-log-driver-logging-strategy';
import { errorLogDriverLoggingStrategy } from './logging-strategies/error-log-driver-logging-strategy';
import { infoLogDriverLoggingStrategy } from './logging-strategies/info-log-driver-logging-strategy';
import { traceLogDriverLoggingStrategy } from './logging-strategies/trace-log-driver-logging-strategy';
import { warningLogDriverLoggingStrategy } from './logging-strategies/warning-log-driver-logging-strategy';
import { LumberjackLogDriver } from './lumberjack-log-driver';
import { LumberjackLogDriverLog } from './lumberjack-log-driver.log';

export function createLumberjackLogDriverLogger<TPayload extends LumberjackLogPayload | void = void>() {
  const logDriverLoggingStrategy: LogDriverLoggingStrategy<TPayload> = {
    [LumberjackLevel.Critical]: criticalLogDriverLoggingStrategy,
    [LumberjackLevel.Debug]: debugLogDriverLoggingStrategy,
    [LumberjackLevel.Error]: errorLogDriverLoggingStrategy,
    [LumberjackLevel.Info]: infoLogDriverLoggingStrategy,
    [LumberjackLevel.Trace]: traceLogDriverLoggingStrategy,
    [LumberjackLevel.Warning]: warningLogDriverLoggingStrategy,
  };

  /**
   * Log the specified log to the log driver.
   *
   * Forwards control to the log driver logging strategy corresponding to the
   * level of the specified log driver log.
   *
   * @param driver The log driver.
   * @param driverLog A log driver log.
   */
  function log(driver: LumberjackLogDriver<TPayload>, driverLog: LumberjackLogDriverLog<TPayload>): void {
    logDriverLoggingStrategy[driverLog.log.level](driver, driverLog);
  }

  return { log };
}
