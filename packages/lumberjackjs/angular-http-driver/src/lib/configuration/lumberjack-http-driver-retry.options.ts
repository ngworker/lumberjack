/**
 * Settings for retrying failed HTTP requests.
 */
export interface LumberjackAngularHttpDriverRetryOptions {
  /**
   * The delay in milliseconds bewteen each retry.
   */
  readonly delayMs: number;
  /**
   * The maximum number of retry attempts made before an HTTP request fails.
   */
  readonly maxRetries: number;
}
