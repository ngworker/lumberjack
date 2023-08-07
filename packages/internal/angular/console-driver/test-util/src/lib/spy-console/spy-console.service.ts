import { Injectable } from '@angular/core';

import { LumberjackConsole } from '@lumberjackjs/angular/console-driver';

/**
 * Spy console logger.
 *
 * Every method is a spy.
 */
@Injectable()
export class SpyConsole implements LumberjackConsole, jest.Mocked<LumberjackConsole> {
  readonly debug = jest.fn();
  readonly error = jest.fn();
  readonly info = jest.fn();
  readonly trace = jest.fn();
  readonly warn = jest.fn();

  /**
   * Reset tracking on spies.
   */
  reset(): void {
    this.error.mockClear();
    this.info.mockClear();
    this.trace.mockClear();
    this.warn.mockClear();
    this.debug.mockClear();
  }
}
