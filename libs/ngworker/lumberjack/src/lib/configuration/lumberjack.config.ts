import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';

import { LumberjackFormatFunction } from './lumberjack-format-function';

// tslint:disable-next-line: no-any
export interface LumberjackConfig<F extends Readonly<{ [key: string]: unknown }> | void = void> {
  readonly format: LumberjackFormatFunction<F>;
  readonly levels: LumberjackConfigLevels;
}
