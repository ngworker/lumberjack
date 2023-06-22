import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { createLumberjackLogFormatter } from './create-lumberjack-log-formatter';

export type LumberjackLogFormatter<TPayload extends LumberjackLogPayload | void = void> = ReturnType<
  typeof createLumberjackLogFormatter<TPayload>
>;
