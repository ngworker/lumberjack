import { LumberjackDriverConfig } from '@lumberjackjs/core';

import { LumberjackAngularHttpDriverRetryOptions } from './lumberjack-angular-http-driver-retry.options';

/**
 * Settings used by the HTTP driver.
 */
export interface LumberjackAngularHttpDriverInternalConfig extends LumberjackDriverConfig {
  /**
   * The identifier of the application that emitted the log.
   *
   * This is used by the log store to organize logs.
   */
  readonly origin: string;
  /**
   * Settings for retrying failed HTTP requests.
   */
  readonly retryOptions: LumberjackAngularHttpDriverRetryOptions;
  /**
   * The URL of the log store endpoint.
   *
   * NOTE! The endpoint matching this url MUST support the POST HTTP verb.
   */
  readonly storeUrl: string;
}