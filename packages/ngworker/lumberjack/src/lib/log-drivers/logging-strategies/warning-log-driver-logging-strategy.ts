import { LumberjackLogDriverLoggingStrategy } from './lumberjack-log-driver-logging-strategy';

/**
 * Warning logging strategy for a log driver.
 *
 * @param driver The log driver.
 * @param driverLog A warning log driver log.
 */
export const warningLogDriverLoggingStrategy: LumberjackLogDriverLoggingStrategy = (driver, driverLog) => {
  driver.logWarning(driverLog);
};
