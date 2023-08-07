import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { createLumberjackLogDriverLogger } from './create-lumberjack-log-driver-logger';

export type LumberjackLogDriverLogger<TPayload extends LumberjackLogPayload | void = void> = ReturnType<
  typeof createLumberjackLogDriverLogger<TPayload>
>;
