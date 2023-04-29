import { LumberjackLogPayload } from '@webworkers/lumberjack';

import { LumberjackLogDriver } from '../lumberjack-log-driver';
import { LumberjackLogDriverLog } from '../lumberjack-log-driver.log';

/**
 * Warning logging strategy for a log driver.
 *
 * @param driver The log driver.
 * @param driverLog A warning log driver log.
 */
export function warningLogDriverLoggingStrategy<TPayload extends LumberjackLogPayload | void = void>(
  driver: LumberjackLogDriver<TPayload>,
  driverLog: LumberjackLogDriverLog<TPayload>
): void {
  driver.logWarning(driverLog);
}
