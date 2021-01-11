import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { LumberjackFormatFunction } from './lumberjack-format-function';

export interface LumberjackConfig<TPayload extends LumberjackLogPayload | void = void> {
  readonly format: LumberjackFormatFunction<TPayload>;
  readonly levels: LumberjackConfigLevels;
}
