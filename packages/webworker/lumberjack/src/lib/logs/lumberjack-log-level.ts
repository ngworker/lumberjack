import { LumberjackLevel } from './lumberjack-level';

/**
 * Level used to represent severity of a log.
 */
export type LumberjackLogLevel = Exclude<LumberjackLevel, LumberjackLevel.Verbose>;
