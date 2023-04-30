import {
  criticalLogDriverLoggingStrategy,
  debugLogDriverLoggingStrategy,
  errorLogDriverLoggingStrategy,
  infoLogDriverLoggingStrategy,
  LumberjackLevel,
  LumberjackLogDriver,
  LumberjackLogDriverLog,
  LumberjackLogPayload,
  traceLogDriverLoggingStrategy,
  warningLogDriverLoggingStrategy,
} from '@webworkers/lumberjack';

import { Injectable } from '@angular/core';

/**
 * A context for a log driver logging strategy.
 */
@Injectable()
export class LumberjackLogDriverLogger<TPayload extends LumberjackLogPayload | void = void> {
  private readonly [LumberjackLevel.Critical] = criticalLogDriverLoggingStrategy;
  private readonly [LumberjackLevel.Debug] = debugLogDriverLoggingStrategy;
  private readonly [LumberjackLevel.Error] = errorLogDriverLoggingStrategy;
  private readonly [LumberjackLevel.Info] = infoLogDriverLoggingStrategy;
  private readonly [LumberjackLevel.Trace] = traceLogDriverLoggingStrategy;
  private readonly [LumberjackLevel.Warning] = warningLogDriverLoggingStrategy;

  /**
   * Log the specified log to the log driver.
   *
   * Forwards control to the log driver logging strategy corresponding to the
   * level of the specified log driver log.
   *
   * @param driver The log driver.
   * @param driverLog A log driver log.
   */
  log(driver: LumberjackLogDriver<TPayload>, driverLog: LumberjackLogDriverLog<TPayload>): void {
    this[driverLog.log.level](driver, driverLog);
  }
}
