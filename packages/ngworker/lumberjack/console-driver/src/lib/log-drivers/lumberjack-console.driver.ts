import { inject, Injectable } from '@angular/core';

import { LumberjackLogDriver, LumberjackLogDriverLog, LumberjackLogPayload } from '@ngworker/lumberjack';

import { lumberjackConsoleDriverConfigToken } from '../configuration/lumberjack-console-driver-config.token';
import { lumberjackConsoleToken } from '../console/lumberjack-console.token';

/**
 * The console driver outputs logs to the browser console.
 *
 * It forwards the formatted log and the optional log payload to the relevant
 * method of the browser console API.
 */
@Injectable()
export class LumberjackConsoleDriver<TPayload extends LumberjackLogPayload | void = void>
  implements LumberjackLogDriver<TPayload>
{
  static driverIdentifier = 'LumberjackConsoleDriver';

  private console = inject(lumberjackConsoleToken);

  config = inject(lumberjackConsoleDriverConfigToken);

  /**
   * Output console error.
   *
   * @param param0 The log and its text representation.
   */
  logCritical({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    this.console.error(formattedLog, payload);
  }

  /**
   * Output console debug message.
   *
   * @param param0 The log and its text representation.
   */
  logDebug({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    this.console.debug(formattedLog, payload);
  }

  /**
   * Output console error.
   *
   * @param param0 The log and its text representation.
   */
  logError({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    this.console.error(formattedLog, payload);
  }

  /**
   * Output console info.
   *
   * @param param0 The log and its text representation.
   */
  logInfo({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    this.console.info(formattedLog, payload);
  }

  /**
   * Output console trace.
   *
   * @param param0 The log and its text representation.
   */
  logTrace({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    this.console.trace(formattedLog, payload);
  }

  /**
   * Output console warning.
   *
   * @param param0 The log and its text representation.
   */
  logWarning({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    this.console.warn(formattedLog, payload);
  }
}
