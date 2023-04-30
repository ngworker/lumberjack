import { LumberjackLogPayload } from '../../logs/lumberjack-log-payload';
import { LumberjackLogDriver } from '../lumberjack-log-driver';
import { LumberjackLogDriverLog } from '../lumberjack-log-driver.log';

/**
 * Trace logging strategy for a log driver.
 *
 * @param driver The log driver.
 * @param driverLog A trace log driver log.
 */
export function traceLogDriverLoggingStrategy<TPayload extends LumberjackLogPayload | void = void>(
  driver: LumberjackLogDriver<TPayload>,
  driverLog: LumberjackLogDriverLog<TPayload>
): void {
  driver.logTrace(driverLog);
}
