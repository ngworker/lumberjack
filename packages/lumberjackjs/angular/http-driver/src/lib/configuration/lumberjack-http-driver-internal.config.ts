import { LumberjackLogDriverConfig } from '@lumberjackjs/core';

import { LumberjackHttpDriverRetryOptions } from './lumberjack-http-driver-retry.options';

/**
 * Settings used by the HTTP driver.
 */
export interface LumberjackHttpDriverInternalConfig extends LumberjackLogDriverConfig {
  /**
   * The identifier of the application that emitted the log.
   *
   * This is used by the log store to organize logs.
   */
  readonly origin: string;
  /**
   * Settings for retrying failed HTTP requests.
   */
  readonly retryOptions: LumberjackHttpDriverRetryOptions;
  /**
   * The URL of the log store endpoint.
   *
   * NOTE! The endpoint matching this url MUST support the POST HTTP verb.
   */
  readonly storeUrl: string;
}
