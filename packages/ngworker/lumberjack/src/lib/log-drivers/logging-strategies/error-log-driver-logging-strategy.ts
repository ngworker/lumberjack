import { LumberjackLogDriverLoggingStrategy } from './lumberjack-log-driver-logging-strategy';

/**
 * Error logging strategy for a log driver.
 *
 * @param driver The log driver.
 * @param driverLog An error log driver log.
 */
export const errorLogDriverLoggingStrategy: LumberjackLogDriverLoggingStrategy = (driver, driverLog) => {
  driver.logError(driverLog);
};
