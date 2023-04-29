import { LumberjackLogPayload } from '@webworkers/lumberjack';

import { LumberjackLogDriver } from '../lumberjack-log-driver';
import { LumberjackLogDriverLog } from '../lumberjack-log-driver.log';

/**
 * Info logging strategy for a log driver.
 *
 * @param driver The log driver.
 * @param driverLog An info log driver log.
 */
export function infoLogDriverLoggingStrategy<TPayload extends LumberjackLogPayload | void = void>(
  driver: LumberjackLogDriver<TPayload>,
  driverLog: LumberjackLogDriverLog<TPayload>
): void {
  driver.logInfo(driverLog);
}
