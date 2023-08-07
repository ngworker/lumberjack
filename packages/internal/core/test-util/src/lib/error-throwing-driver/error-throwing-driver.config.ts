import { LumberjackLogDriverConfig } from '@lumberjackjs/core';

export interface ErrorThrowingDriverConfig extends LumberjackLogDriverConfig {
  /**
   * Number of logs that will succeed before throwing an error.
   */
  readonly logsBeforeThrowing: number;
}
