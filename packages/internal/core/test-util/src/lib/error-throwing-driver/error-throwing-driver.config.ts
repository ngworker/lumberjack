import { LumberjackDriverConfig } from '@lumberjackjs/core';

export interface ErrorThrowingDriverConfig extends LumberjackDriverConfig {
  /**
   * Number of logs that will succeed before throwing an error.
   */
  readonly logsBeforeThrowing: number;
}
