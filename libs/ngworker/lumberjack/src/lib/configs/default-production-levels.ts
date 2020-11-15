import { LumberjackLogConfigLevel, LumberjackLogLevel } from '../lumberjack-log-levels';

export const defaultProductionLevels: LumberjackLogConfigLevel = [
  LumberjackLogLevel.Critical,
  LumberjackLogLevel.Error,
  LumberjackLogLevel.Info,
  LumberjackLogLevel.Warning,
];
