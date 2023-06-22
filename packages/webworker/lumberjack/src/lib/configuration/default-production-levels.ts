import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';
import { LumberjackLevel } from '../logs/lumberjack-level';

/*
 * The default Lumberjack log levels allowed on production.
 */
export const defaultProductionLevels: LumberjackConfigLevels = [
  LumberjackLevel.Critical,
  LumberjackLevel.Error,
  LumberjackLevel.Info,
  LumberjackLevel.Warning,
];
