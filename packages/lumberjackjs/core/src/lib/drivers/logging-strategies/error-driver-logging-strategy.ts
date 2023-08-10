import { LumberjackLogPayload } from '../../logs/lumberjack-log-payload';
import { LumberjackDriver } from '../lumberjack-driver';
import { LumberjackDriverLog } from '../lumberjack-driver.log';

/**
 * Error logging strategy for a driver.
 *
 * @param driver The driver.
 * @param driverLog An error driver log.
 */
export function errorDriverLoggingStrategy<TPayload extends LumberjackLogPayload | void = void>(
  driver: LumberjackDriver<TPayload>,
  driverLog: LumberjackDriverLog<TPayload>
): void {
  driver.logError(driverLog);
}
