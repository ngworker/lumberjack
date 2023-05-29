import { LumberjackLogDriverLoggingStrategy } from './lumberjack-log-driver-logging-strategy';

/**
 * Critical logging strategy for a log driver.
 *
 * @param driver The log driver.
 * @param driverLog A critical log driver log.
 */
export const criticalLogDriverLoggingStrategy: LumberjackLogDriverLoggingStrategy = (driver, driverLog) => {
  driver.logCritical(driverLog);
};
