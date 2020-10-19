import { Inject, Injectable, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import {
  defaultLogDriverConfig,
  LogDriver,
  LogDriverConfig,
  LogDriverConfigToken,
  LogDriverToken,
} from '@ngworker/lumberjack';

/**
 * No-op log driver.
 */
@Injectable()
export class NoopDriver implements LogDriver {
  constructor(@Inject(LogDriverConfigToken) public config: LogDriverConfig) {}
  logInfo(logEntry: string): void {}
  logDebug(logEntry: string): void {}
  logError(logEntry: string): void {}
  logWarning(logEntry: string): void {}
}
