import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';

import { LumberjackFormatFunction } from './lumberjack-format-function';

// tslint:disable-next-line: no-any
export interface LumberjackConfig<TPayload extends Readonly<{ [key: string]: unknown }> | void = void> {
  readonly format: LumberjackFormatFunction<TPayload>;
  readonly levels: LumberjackConfigLevels;
}
