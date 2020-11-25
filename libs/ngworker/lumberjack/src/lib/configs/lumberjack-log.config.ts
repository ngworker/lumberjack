import { LumberjackLogConfigLevel } from '../lumberjack-log-levels';

import { FormatFunction } from './format-function';

export interface LumberjackLogConfig {
  format: FormatFunction;
  levels: LumberjackLogConfigLevel;
}
