import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';

import { LumberjackLogFormatterResult } from './lumberjack-log-formatter-result';

export type LumberjackLogFormatter<TPayload extends LumberjackLogPayload | void = void> = (
  log: LumberjackLog<TPayload>
) => LumberjackLogFormatterResult<TPayload>;
