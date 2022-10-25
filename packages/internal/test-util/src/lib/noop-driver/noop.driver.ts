/* eslint-disable @typescript-eslint/no-unused-vars */
// ⬆️ Maintain signature compatibility with LumberjackLogDriver
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

  logCritical(_driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  logDebug(_driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  logError(_driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  logInfo(_driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  logTrace(_driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  logWarning(_driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }
}
