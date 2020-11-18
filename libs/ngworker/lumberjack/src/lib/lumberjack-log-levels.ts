/*
 * Log levels used by our `Lumberjack` Loggers
 *
 */
export enum LumberjackLogLevel {
  Critical = 'critical',
  Debug = 'debug',
  Error = 'error',
  Info = 'info',
  Trace = 'trace',
  Verbose = 'verbose',
  Warning = 'warn',
}

export type LumberjackLogConfigLevel = ReadonlyArray<LumberjackLogEntryLevel> | [LumberjackLogLevel.Verbose];

export type LumberjackLogEntryLevel = Exclude<LumberjackLogLevel, LumberjackLogLevel.Verbose>;
