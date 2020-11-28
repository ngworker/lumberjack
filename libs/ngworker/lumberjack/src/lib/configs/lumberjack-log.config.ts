import { LumberjackLogConfigLevels } from '../logs/lumberjack-log-levels';

import { LumberjackLogFormatFunction } from './lumberjack-log-format-function';

export interface LumberjackLogConfig {
  readonly format: LumberjackLogFormatFunction;
  readonly levels: LumberjackLogConfigLevels;
}
