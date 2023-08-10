import { LumberjackLogPayload } from '../../logs/lumberjack-log-payload';
import { LumberjackDriver } from '../lumberjack-driver';
import { LumberjackDriverLog } from '../lumberjack-driver.log';

/**
 * Debug logging strategy for a driver.
 *
 * @param driver The driver.
 * @param driverLog A debug driver log.
 */
export function debugDriverLoggingStrategy<TPayload extends LumberjackLogPayload | void = void>(
  driver: LumberjackDriver<TPayload>,
  driverLog: LumberjackDriverLog<TPayload>
): void {
  driver.logDebug(driverLog);
}
