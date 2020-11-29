import { LumberjackLevel } from './lumberjack-level';
import { LumberjackLogLevel } from './lumberjack-log-level';

export type LumberjackLogConfigLevels = ReadonlyArray<LumberjackLogLevel> | [LumberjackLevel.Verbose];
