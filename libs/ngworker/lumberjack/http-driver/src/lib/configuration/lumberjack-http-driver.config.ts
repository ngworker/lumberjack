import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { LumberjackHttpDriverRetryOptions } from './lumberjack-http-driver-retry.options';

export interface LumberjackHttpDriverConfig extends LumberjackLogDriverConfig {
  /**
   * The identifier of the app which emitted the log.
   * This is used to organize logs on the log store.
   */
  readonly origin: string;
  /**
   * The desired retry behavior options on failed requests.
   */
  readonly retryOptions: LumberjackHttpDriverRetryOptions;
  /**
   * The url of the log store endpoint.
   *
   * The endpoint matching this url MUST support the POST method.
   */
  readonly storeUrl: string;
}
