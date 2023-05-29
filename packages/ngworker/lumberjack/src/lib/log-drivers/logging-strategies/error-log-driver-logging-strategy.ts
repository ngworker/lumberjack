import { LumberjackLogPayload } from '../../logs/lumberjack-log-payload';
import { LumberjackLogDriver } from '../lumberjack-log-driver';
import { LumberjackLogDriverLog } from '../lumberjack-log-driver.log';

/**
 * Error logging strategy for a log driver.
 *
 * @param driver The log driver.
 * @param driverLog An error log driver log.
 */
export function errorLogDriverLoggingStrategy<TPayload extends LumberjackLogPayload | void = void>(
  driver: LumberjackLogDriver<TPayload>,
  driverLog: LumberjackLogDriverLog<TPayload>
): void {
  driver.logError(driverLog);
}
