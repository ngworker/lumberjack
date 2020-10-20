/*
 * Log levels used by our `Lumberjack` Loggers
 *
 */
export enum LumberjackLogLevel {
  Debug = 'debug',
  Verbose = 'verbose',
  Info = 'info',
  Warning = 'warn',
  Error = 'error',
}

export type LumberjackLogLevelComposable = Exclude<LumberjackLogLevel, LumberjackLogLevel.Verbose>;
