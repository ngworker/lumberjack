import { Injectable } from '@angular/core';

import { LumberjackConsole } from '@ngworker/lumberjack/console-driver';

/**
 * No-op console logger.
 *
 * Every method is a no-op.
 */
@Injectable()
export class NoopConsole implements LumberjackConsole {
  // tslint:disable: no-any
  debug(...data: any[]): void;
  debug(message?: any, ...optionalParams: any[]): void;
  debug(message?: any, ...optionalParams: any[]) {}

  error(...data: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]) {}

  info(...data: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]) {}

  trace(...data: any[]): void;
  trace(message?: any, ...optionalParams: any[]): void;
  trace(message?: any, ...optionalParams: any[]) {}

  warn(...data: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]) {}
  // tslint:enable: no-any
}
