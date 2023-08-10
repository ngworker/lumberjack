/**
 * Optional payload with custom properties for a log.
 *
 * This does not have to be the same for all logs.
 *
 * NOTE! Make sure that these properties are supported by your drivers.
 */
export interface LumberjackLogPayload {
  /**
   * A custom property for a log.
   *
   * NOTE! Make sure that this property is supported by your drivers.
   */
  readonly [property: string]: unknown;
}
