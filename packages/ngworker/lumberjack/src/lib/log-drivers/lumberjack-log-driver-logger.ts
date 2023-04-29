import { Injectable } from '@angular/core';
import { LumberjackLevel, LumberjackLogPayload } from '@webworkers/lumberjack';

import { criticalLogDriverLoggingStrategy } from './logging-strategies/critical-log-driver-logging-strategy';
import { debugLogDriverLoggingStrategy } from './logging-strategies/debug-log-driver-logging-strategy';
import { errorLogDriverLoggingStrategy } from './logging-strategies/error-log-driver-logging-strategy';
import { infoLogDriverLoggingStrategy } from './logging-strategies/info-log-driver-logging-strategy';
import { LumberjackLogDriverLoggingStrategy } from './logging-strategies/lumberjack-log-driver-logging-strategy';
import { traceLogDriverLoggingStrategy } from './logging-strategies/trace-log-driver-logging-strategy';
import { warningLogDriverLoggingStrategy } from './logging-strategies/warning-log-driver-logging-strategy';
import { LumberjackLogDriver } from './lumberjack-log-driver';
import { LumberjackLogDriverLog } from './lumberjack-log-driver.log';

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
