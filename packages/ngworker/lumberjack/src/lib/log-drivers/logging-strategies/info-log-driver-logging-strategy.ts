import { LumberjackLogDriverLoggingStrategy } from './lumberjack-log-driver-logging-strategy';

/**
 * Info logging strategy for a log driver.
 *
 * @param driver The log driver.
 * @param driverLog An info log driver log.
 */
export const infoLogDriverLoggingStrategy: LumberjackLogDriverLoggingStrategy = (driver, driverLog) => {
  driver.logInfo(driverLog);
};
