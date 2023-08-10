import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { LumberjackDriver } from './lumberjack-driver';
import { LumberjackDriverLog } from './lumberjack-driver.log';

export type DriverLoggingStrategy<TPayload extends LumberjackLogPayload | void = void> = Record<
  LumberjackLogLevel,
  (driver: LumberjackDriver<TPayload>, driverLog: LumberjackDriverLog<TPayload>) => void
>;
