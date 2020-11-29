import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackConfigLevels } from '../logs/lumberjack-log-levels';

export const defaultProductionLevels: LumberjackConfigLevels = [
  LumberjackLevel.Critical,
  LumberjackLevel.Error,
  LumberjackLevel.Info,
  LumberjackLevel.Warning,
];
