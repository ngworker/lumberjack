import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';
import { LumberjackLevel } from '../logs/lumberjack-level';

/*
 * The default Lumberjack log levels allowed on development.
 */
export const defaultDevelopmentLevels: LumberjackConfigLevels = [LumberjackLevel.Verbose];
