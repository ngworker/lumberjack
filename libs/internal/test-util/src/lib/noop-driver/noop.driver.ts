/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@angular/core';

import {
  LumberjackLogDriver,
  LumberjackLogDriverConfig,
  LumberjackLogDriverLog,
  LumberjackLogPayload,
} from '@ngworker/lumberjack';

import { noopDriverConfigToken } from './noop-driver-config.token';

/**
 * No-op log driver.
 *
 * Every logging method is a no-op.
 */
@Injectable()
export class NoopDriver<TPayload extends LumberjackLogPayload | void = void> implements LumberjackLogDriver<TPayload> {
  static driverIdentifier = 'NoopDriver';

  constructor(@Inject(noopDriverConfigToken) readonly config: LumberjackLogDriverConfig) {}

  logCritical(driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  logDebug(driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  logError(driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  logInfo(driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  logTrace(driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  logWarning(driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }
}
