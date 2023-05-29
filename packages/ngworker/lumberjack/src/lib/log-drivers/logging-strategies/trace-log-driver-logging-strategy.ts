import { LumberjackLogDriverLoggingStrategy } from './lumberjack-log-driver-logging-strategy';

/**
 * Trace logging strategy for a log driver.
 *
 * @param driver The log driver.
 * @param driverLog A trace log driver log.
 */
export const traceLogDriverLoggingStrategy: LumberjackLogDriverLoggingStrategy = (driver, driverLog) => {
  driver.logTrace(driverLog);
};
