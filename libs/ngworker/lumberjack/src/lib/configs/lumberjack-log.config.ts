import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';

import { LumberjackLogFormatFunction } from './lumberjack-log-format-function';

export interface LumberjackLogConfig {
  readonly format: LumberjackLogFormatFunction;
  readonly levels: LumberjackConfigLevels;
}
