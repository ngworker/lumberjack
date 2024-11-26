/**
 * All supported levels supported by Lumberjack. Used to specify the severity of a log and to configure Lumberjack and the log drivers.
 *
 * @example
 * ```typescript
 * import { LumberjackLevel } from '@ngworker/lumberjack';
 * ```
 */
export type LumberjackLevel = 'critical' | 'debug' | 'error' | 'info' | 'trace' | 'verbose' | 'warn';
