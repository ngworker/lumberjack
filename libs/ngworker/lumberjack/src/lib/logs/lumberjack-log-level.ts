import { LumberjackLevel } from './lumberjack-level';

export type LumberjackLogLevel = Exclude<LumberjackLevel, LumberjackLevel.Verbose>;
