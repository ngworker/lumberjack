import { Inject, Injectable } from '@angular/core';

import {
  LumberjackLogDriver,
  LumberjackLogDriverConfig,
  LumberjackLogDriverLog,
  LumberjackLogPayload,
} from '@ngworker/lumberjack';

import { lumberjackConsoleDriverConfigToken } from '../configuration/lumberjack-console-driver-config.token';
import { LumberjackConsole } from '../console/lumberjack-console';
import { lumberjackConsoleToken } from '../console/lumberjack-console.token';

/**
 * The console driver outputs logs to the browser console.
 *
 * It forwards the formatted log and the optional log payload to the relevant
 * method of the brower console API.
 */
@Injectable()
export class LumberjackConsoleDriver<TPayload extends LumberjackLogPayload | void = void>
  implements LumberjackLogDriver<TPayload> {
  constructor(
    @Inject(lumberjackConsoleDriverConfigToken) public config: LumberjackLogDriverConfig,
    @Inject(lumberjackConsoleToken) private console: LumberjackConsole
  ) {}

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
    // tslint:disable-next-line: no-console
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
