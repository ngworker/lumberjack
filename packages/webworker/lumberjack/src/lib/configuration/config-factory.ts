import { lumberjackFormatLog } from '../formatting/lumberjack-format-log';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { defaultDevelopmentLevels } from './default-development-levels';
import { defaultProductionLevels } from './default-production-levels';
import { LumberjackConfig } from './lumberjack.config';
import { LumberjackOptions } from './lumberjack.options';

export function createLumberjackConfig<TPayload extends LumberjackLogPayload | void = void>(
  isProductionEnvironment: boolean,
  options: LumberjackOptions = {}
): LumberjackConfig<TPayload> {
  return {
    format: lumberjackFormatLog<TPayload>,
    levels: isProductionEnvironment ? defaultProductionLevels : defaultDevelopmentLevels,
    ...options,
  } as LumberjackConfig<TPayload>;
}
