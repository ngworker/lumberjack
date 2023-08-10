import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { createLumberjackDriverLogger } from './create-lumberjack-driver-logger';

export type LumberjackDriverLogger<TPayload extends LumberjackLogPayload | void = void> = ReturnType<
  typeof createLumberjackDriverLogger<TPayload>
>;
