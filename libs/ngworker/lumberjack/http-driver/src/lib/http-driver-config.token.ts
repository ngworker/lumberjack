import { InjectionToken } from '@angular/core';

import { LogDriverConfig } from '@ngworker/lumberjack';

export const httpDriverConfigToken: InjectionToken<HttpDriverConfig> = new InjectionToken('__HTTP_DRIVER_CONFIG__');

export interface HttpDriverConfig extends LogDriverConfig {
  /**
   *
   * The identifier of the app who emitted the log.
   * This is used to organize logs on the log store.
   *
   */
  origin: string;
  /**
   *
   * The url of the log store endpoint.
   *
   * The endpoint matching this url MUST support the POST method.
   */
  storeUrl: string;
  /**
   *
   * The desired retry behavior options on failed requests
   *
   */
  retryOptions: { maxRetries: number; delayMs: number };
}
