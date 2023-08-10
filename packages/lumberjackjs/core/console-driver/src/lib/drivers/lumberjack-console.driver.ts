import {
  LumberjackDriver,
  LumberjackDriverConfig,
  LumberjackDriverLog,
  LumberjackLogPayload,
} from '@lumberjackjs/core';

import type { LumberjackConsoleDriverConfig } from '../configuration/lumberjack-console-driver.config';
import { LumberjackConsole } from '../console/lumberjack-console';

/**
 * The console driver outputs logs to the browser console.
 *
 * It forwards the formatted log and the optional log payload to the relevant
 * method of the browser console API.
 */
export class LumberjackConsoleDriver<TPayload extends LumberjackLogPayload | void = void>
  implements LumberjackDriver<TPayload>
{
  static readonly driverIdentifier = 'LumberjackConsoleDriver';

  readonly #console: LumberjackConsole;
  readonly config: LumberjackDriverConfig;

  constructor(config: LumberjackConsoleDriverConfig, lumberjackConsole: LumberjackConsole = console) {
    this.#console = lumberjackConsole;
    this.config = { identifier: LumberjackConsoleDriver.driverIdentifier, ...config };
  }

  /**
   * Output console error.
   *
   * @param param0 The log and its text representation.
   */
  logCritical({ formattedLog, log: { payload } }: LumberjackDriverLog<TPayload>): void {
    this.#console.error(formattedLog, payload);
  }

  /**
   * Output console debug message.
   *
   * @param param0 The log and its text representation.
   */
  logDebug({ formattedLog, log: { payload } }: LumberjackDriverLog<TPayload>): void {
    this.#console.debug(formattedLog, payload);
  }

  /**
   * Output console error.
   *
   * @param param0 The log and its text representation.
   */
  logError({ formattedLog, log: { payload } }: LumberjackDriverLog<TPayload>): void {
    this.#console.error(formattedLog, payload);
  }

  /**
   * Output console info.
   *
   * @param param0 The log and its text representation.
   */
  logInfo({ formattedLog, log: { payload } }: LumberjackDriverLog<TPayload>): void {
    this.#console.info(formattedLog, payload);
  }

  /**
   * Output console trace.
   *
   * @param param0 The log and its text representation.
   */
  logTrace({ formattedLog, log: { payload } }: LumberjackDriverLog<TPayload>): void {
    this.#console.trace(formattedLog, payload);
  }

  /**
   * Output console warning.
   *
   * @param param0 The log and its text representation.
   */
  logWarning({ formattedLog, log: { payload } }: LumberjackDriverLog<TPayload>): void {
    this.#console.warn(formattedLog, payload);
  }
}
