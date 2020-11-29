import { LumberjackLevel } from './lumberjack-level';

export type LumberjackLogConfigLevels = ReadonlyArray<LumberjackLogEntryLevel> | [LumberjackLevel.Verbose];

export type LumberjackLogEntryLevel = Exclude<LumberjackLevel, LumberjackLevel.Verbose>;
