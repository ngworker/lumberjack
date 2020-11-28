import { LumberjackLevel, LumberjackLogConfigLevels } from '../logs/lumberjack-log-levels';

export const defaultProductionLevels: LumberjackLogConfigLevels = [
  LumberjackLevel.Critical,
  LumberjackLevel.Error,
  LumberjackLevel.Info,
  LumberjackLevel.Warning,
];
