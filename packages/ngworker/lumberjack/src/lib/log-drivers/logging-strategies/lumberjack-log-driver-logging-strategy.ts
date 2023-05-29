import { LumberjackLogPayload } from '../../logs/lumberjack-log-payload';
import { LumberjackLogDriver } from '../lumberjack-log-driver';
import { LumberjackLogDriverLog } from '../lumberjack-log-driver.log';

/**
 * A logging strategy for a log driver.
 *
 * @param driver The log driver.
 * @param driverLog A log driver log.
 */
export type LumberjackLogDriverLoggingStrategy = <TPayload extends LumberjackLogPayload | void = void>(
  driver: LumberjackLogDriver<TPayload>,
  driverLog: LumberjackLogDriverLog<TPayload>
) => void;
