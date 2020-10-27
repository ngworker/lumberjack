/*
 * Log levels used by our `Lumberjack` Loggers
 *
 */
export enum LumberjackLogLevel {
  Debug = 'debug',
  Error = 'error',
  Info = 'info',
  Verbose = 'verbose',
  Warning = 'warn',
}

export type LumberjackLogEntryLevel = Exclude<LumberjackLogLevel, LumberjackLogLevel.Verbose>;
