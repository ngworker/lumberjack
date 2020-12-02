import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';

import { LumberjackLogFormatFunction } from './lumberjack-log-format-function';

export interface LumberjackConfig {
  readonly format: LumberjackLogFormatFunction;
  readonly levels: LumberjackConfigLevels;
}
