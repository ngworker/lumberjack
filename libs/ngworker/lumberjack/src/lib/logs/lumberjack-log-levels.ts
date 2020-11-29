import { LumberjackLevel } from './lumberjack-level';

export type LumberjackLogConfigLevels = ReadonlyArray<LumberjackLogLevel> | [LumberjackLevel.Verbose];

export type LumberjackLogLevel = Exclude<LumberjackLevel, LumberjackLevel.Verbose>;
