import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { LumberjackDriver } from './lumberjack-driver';
import { LumberjackDriverLog } from './lumberjack-driver.log';

export type LumberjackDriverLogger<TPayload extends LumberjackLogPayload | void = void> = {
  log: (driver: LumberjackDriver<TPayload>, driverLog: LumberjackDriverLog<TPayload>) => void;
};
