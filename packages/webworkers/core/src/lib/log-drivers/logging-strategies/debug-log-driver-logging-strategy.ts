import { LumberjackLogPayload } from '@webworkers/lumberjack';

import { LumberjackLogDriver } from '../lumberjack-log-driver';
import { LumberjackLogDriverLog } from '../lumberjack-log-driver.log';

/**
 * Debug logging strategy for a log driver.
 *
 * @param driver The log driver.
 * @param driverLog A debug log driver log.
 */
export function debugLogDriverLoggingStrategy<TPayload extends LumberjackLogPayload | void = void>(
  driver: LumberjackLogDriver<TPayload>,
  driverLog: LumberjackLogDriverLog<TPayload>
): void {
  driver.logDebug(driverLog);
}
