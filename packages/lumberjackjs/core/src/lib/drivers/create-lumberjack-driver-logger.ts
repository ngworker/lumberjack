import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { DriverLoggingStrategy } from './driver-logging-strategy';
import { criticalDriverLoggingStrategy } from './logging-strategies/critical-driver-logging-strategy';
import { debugDriverLoggingStrategy } from './logging-strategies/debug-driver-logging-strategy';
import { errorDriverLoggingStrategy } from './logging-strategies/error-driver-logging-strategy';
import { infoDriverLoggingStrategy } from './logging-strategies/info-driver-logging-strategy';
import { traceDriverLoggingStrategy } from './logging-strategies/trace-driver-logging-strategy';
import { warningDriverLoggingStrategy } from './logging-strategies/warning-driver-logging-strategy';
import { LumberjackDriver } from './lumberjack-driver';
import { LumberjackDriverLogger } from './lumberjack-driver-logger';
import { LumberjackDriverLog } from './lumberjack-driver.log';

export function createLumberjackDriverLogger<
  TPayload extends LumberjackLogPayload | void = void
>(): LumberjackDriverLogger<TPayload> {
  const driverLoggingStrategy: DriverLoggingStrategy<TPayload> = {
    [LumberjackLevel.Critical]: criticalDriverLoggingStrategy,
    [LumberjackLevel.Debug]: debugDriverLoggingStrategy,
    [LumberjackLevel.Error]: errorDriverLoggingStrategy,
    [LumberjackLevel.Info]: infoDriverLoggingStrategy,
    [LumberjackLevel.Trace]: traceDriverLoggingStrategy,
    [LumberjackLevel.Warning]: warningDriverLoggingStrategy,
  };

  /**
   * Log the specified log to the driver.
   *
   * Forwards control to the driver logging strategy corresponding to the
   * level of the specified driver log.
   *
   * @param driver The driver.
   * @param driverLog A driver log.
   */
  function log(driver: LumberjackDriver<TPayload>, driverLog: LumberjackDriverLog<TPayload>): void {
    driverLoggingStrategy[driverLog.log.level](driver, driverLog);
  }

  return { log };
}
