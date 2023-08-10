import { LumberjackLogPayload } from '../../logs/lumberjack-log-payload';
import { LumberjackDriver } from '../lumberjack-driver';
import { LumberjackDriverLog } from '../lumberjack-driver.log';

/**
 * Info logging strategy for a driver.
 *
 * @param driver The driver.
 * @param driverLog An info driver log.
 */
export function infoDriverLoggingStrategy<TPayload extends LumberjackLogPayload | void = void>(
  driver: LumberjackDriver<TPayload>,
  driverLog: LumberjackDriverLog<TPayload>
): void {
  driver.logInfo(driverLog);
}
