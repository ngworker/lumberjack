import { Injectable } from '@angular/core';

import { ConsoleLogger } from '@ngworker/lumberjack/console-driver';

/**
 * Spy console logger.
 *
 * Every method is a spy.
 */
@Injectable()
export class SpyConsoleLogger implements ConsoleLogger, jasmine.SpyObj<ConsoleLogger> {
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
