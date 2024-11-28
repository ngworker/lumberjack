import { LumberjackLevel } from './lumberjack-level';

/**
 * Level used to represent severity of a log.
 *
 * @example
 * ```typescript
 * import { LumberjackLogLevel } from '@ngworker/lumberjack';
 * ```
 */
export type LumberjackLogLevel = Exclude<LumberjackLevel, 'verbose'>;
