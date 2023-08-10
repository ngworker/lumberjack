import { LumberjackLogPayload } from '../../logs/lumberjack-log-payload';
import { LumberjackDriver } from '../lumberjack-driver';
import { LumberjackDriverLog } from '../lumberjack-driver.log';

/**
 * Critical logging strategy for a driver.
 *
 * @param driver The driver.
 * @param driverLog A critical driver log.
 */
export function criticalDriverLoggingStrategy<TPayload extends LumberjackLogPayload | void = void>(
  driver: LumberjackDriver<TPayload>,
  driverLog: LumberjackDriverLog<TPayload>
): void {
  driver.logCritical(driverLog);
}
