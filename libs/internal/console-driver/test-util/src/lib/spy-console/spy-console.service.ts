import { Injectable } from '@angular/core';

import { LumberjackConsole } from '@ngworker/lumberjack/console-driver';

/**
 * Spy console logger.
 *
 * Every method is a spy.
 */
@Injectable()
export class SpyConsole implements LumberjackConsole, jest.Mocked<LumberjackConsole> {
  debug = jest.fn();

  error = jest.fn();

  info = jest.fn();

  trace = jest.fn();

  warn = jest.fn();

  /**
   * Reset tracking on spies.
   */
  reset(): void {
    this.error.mockClear();
    this.info.mockClear();
    this.trace.mockClear();
    this.warn.mockClear();
    jest.clearAllMocks();
  }
}
