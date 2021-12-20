import { Injectable } from '@angular/core';

import { LumberjackConsole } from '@ngworker/lumberjack/console-driver';

/**
 * No-op console logger.
 *
 * Every method is a no-op.
 */
@Injectable()
export class NoopConsole implements LumberjackConsole {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  debug(...data: any[]): void;
  debug(message?: any, ...optionalParams: any[]): void;
  debug(message?: any, ...optionalParams: any[]) {
    // intentionally a no-op
  }

  error(...data: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]) {
    // intentionally a no-op
  }

  info(...data: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]) {
    // intentionally a no-op
  }

  trace(...data: any[]): void;
  trace(message?: any, ...optionalParams: any[]): void;
  trace(message?: any, ...optionalParams: any[]) {
    // intentionally a no-op
  }

  warn(...data: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]) {
    // intentionally a no-op
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
