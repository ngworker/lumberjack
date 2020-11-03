import { Injectable } from '@angular/core';

import { LumberjackConsole } from '@ngworker/lumberjack/console-driver';

/**
 * Spy console logger.
 *
 * Every method is a spy.
 */
@Injectable()
export class SpyConsole implements LumberjackConsole, jasmine.SpyObj<LumberjackConsole> {
  debug = jasmine.createSpy('debug');

  error = jasmine.createSpy('error');

  info = jasmine.createSpy('info');

  trace = jasmine.createSpy('trace');

  warn = jasmine.createSpy('warn');

  /**
   * Reset tracking on spies.
   */
  reset(): void {
    this.debug.calls.reset();
    this.error.calls.reset();
    this.info.calls.reset();
    this.trace.calls.reset();
    this.warn.calls.reset();
  }
}
