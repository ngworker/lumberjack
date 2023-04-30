import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';
import { LumberjackLevel } from '../logs/lumberjack-level';

export const defaultProductionLevels: LumberjackConfigLevels = [
  LumberjackLevel.Critical,
  LumberjackLevel.Error,
  LumberjackLevel.Info,
  LumberjackLevel.Warning,
];
