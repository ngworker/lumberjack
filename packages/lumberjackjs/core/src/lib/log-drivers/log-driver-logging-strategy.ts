import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { LumberjackLogDriver } from './lumberjack-log-driver';
import { LumberjackLogDriverLog } from './lumberjack-log-driver.log';

export type LogDriverLoggingStrategy<TPayload extends LumberjackLogPayload | void = void> = Record<
  LumberjackLogLevel,
  (driver: LumberjackLogDriver<TPayload>, driverLog: LumberjackLogDriverLog<TPayload>) => void
>;
