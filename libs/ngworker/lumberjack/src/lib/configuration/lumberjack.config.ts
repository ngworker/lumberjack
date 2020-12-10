import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';
import { Payload } from '../logs/payload';

import { LumberjackFormatFunction } from './lumberjack-format-function';

export interface LumberjackConfig<TPayload extends Readonly<Payload> | void = void> {
  readonly format: LumberjackFormatFunction<TPayload>;
  readonly levels: LumberjackConfigLevels;
}
