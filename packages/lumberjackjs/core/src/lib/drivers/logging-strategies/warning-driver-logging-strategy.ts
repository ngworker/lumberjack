import { LumberjackLogPayload } from '../../logs/lumberjack-log-payload';
import { LumberjackDriver } from '../lumberjack-driver';
import { LumberjackDriverLog } from '../lumberjack-driver.log';

/**
 * Warning logging strategy for a driver.
 *
 * @param driver The driver.
 * @param driverLog A warning driver log.
 */
export function warningDriverLoggingStrategy<TPayload extends LumberjackLogPayload | void = void>(
  driver: LumberjackDriver<TPayload>,
  driverLog: LumberjackDriverLog<TPayload>
): void {
  driver.logWarning(driverLog);
}
