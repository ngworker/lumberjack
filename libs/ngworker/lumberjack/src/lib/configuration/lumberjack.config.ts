import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';

import { LumberjackFormatFunction } from './lumberjack-format-function';

export interface LumberjackConfig<TPayload extends Readonly<{ [key: string]: unknown }> | void = void> {
  readonly format: LumberjackFormatFunction<TPayload>;
  readonly levels: LumberjackConfigLevels;
}
