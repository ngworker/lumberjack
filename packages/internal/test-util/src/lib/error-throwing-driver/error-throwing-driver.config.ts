import { LumberjackLogDriverConfig } from '@webworker/lumberjack';

export interface ErrorThrowingDriverConfig extends LumberjackLogDriverConfig {
  /**
   * Number of logs that will succeed before throwing an error.
   */
  readonly logsBeforeThrowing: number;
}
