import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { createLumberjackLogFactory } from './create-lumberjack-log-factory';

export type LumberjackLogFactory<TPayload extends LumberjackLogPayload | void = void> = ReturnType<
  typeof createLumberjackLogFactory<TPayload>
>;
