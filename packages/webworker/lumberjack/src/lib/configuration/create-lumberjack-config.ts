import { lumberjackFormatLog } from '../formatting/lumberjack-format-log';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { defaultDevelopmentLevels } from './default-development-levels';
import { defaultProductionLevels } from './default-production-levels';
import { LumberjackConfig } from './lumberjack.config';
import { LumberjackOptions } from './lumberjack.options';

/**
 * Helps combining the defaults Lumberjack configurations with custom developer configurations.
 * @param isProductionEnvironment - Lumberjack uses different default log levels based on the environment where is running.
 * @param options - LumberjackOptions that overwrite the default configuration.
 * @returns - The combination of default configs and custom overwrites.
 */
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
