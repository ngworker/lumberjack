import { LumberjackLogConfigLevel } from '../lumberjack-log-levels';

import { FormatFunction } from './format-function';

export interface LumberjackLogConfig {
  readonly format: FormatFunction;
  readonly levels: LumberjackLogConfigLevel;
}
