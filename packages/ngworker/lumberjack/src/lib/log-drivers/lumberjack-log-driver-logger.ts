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
  /**
   * A record of logging strategies for each log level.
   */
  readonly #loggingStrategies: Readonly<Record<LumberjackLogLevel, LumberjackLogDriverLoggingStrategy<TPayload>>> = {
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
  log(driver: LumberjackLogDriver<TPayload>, driverLog: LumberjackLogDriverLog<TPayload>): void {
    this.#loggingStrategies[driverLog.log.level](driver, driverLog);
  }
}
