import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { createLumberjack } from './create-lumberjack';

export type Lumberjack<TPayload extends LumberjackLogPayload | void = void> = ReturnType<
  typeof createLumberjack<TPayload>
>;
