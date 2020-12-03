import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

export interface ErrorThrowingDriverConfig extends LumberjackLogDriverConfig {
  /**
   * Number of logs that will succesd before throwing an error.
   */
  readonly logsBeforeThrowing: number;
}
