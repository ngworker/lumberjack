import { LumberjackLogDriverLoggingStrategy } from './lumberjack-log-driver-logging-strategy';

/**
 * Debug logging strategy for a log driver.
 *
 * @param driver The log driver.
 * @param driverLog A debug log driver log.
 */
export const debugLogDriverLoggingStrategy: LumberjackLogDriverLoggingStrategy = (driver, driverLog) => {
  driver.logDebug(driverLog);
};
