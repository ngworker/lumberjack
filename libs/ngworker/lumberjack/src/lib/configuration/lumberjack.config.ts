import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';

import { LumberjackFormatFunction } from './lumberjack-format-function';

export interface LumberjackConfig {
  readonly format: LumberjackFormatFunction;
  readonly levels: LumberjackConfigLevels;
}
