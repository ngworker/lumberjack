import { LumberjackConfigLevels, LumberjackLevel } from '@lumberjackjs/core';

export const defaultProductionLevels: LumberjackConfigLevels = [
  LumberjackLevel.Critical,
  LumberjackLevel.Error,
  LumberjackLevel.Info,
  LumberjackLevel.Warning,
];
