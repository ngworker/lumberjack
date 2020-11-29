import { LumberjackLevel } from './lumberjack-level';
import { LumberjackLogLevel } from './lumberjack-log-level';

export type LumberjackConfigLevels = ReadonlyArray<LumberjackLogLevel> | [LumberjackLevel.Verbose];
