import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogConfigLevels } from '../logs/lumberjack-log-levels';

export const defaultProductionLevels: LumberjackLogConfigLevels = [
  LumberjackLevel.Critical,
  LumberjackLevel.Error,
  LumberjackLevel.Info,
  LumberjackLevel.Warning,
];
