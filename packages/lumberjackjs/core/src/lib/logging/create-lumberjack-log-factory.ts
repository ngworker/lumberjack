import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { LumberjackLogBuilder } from './lumberjack-log.builder';

interface LumberjackLogFactoryDependencies {
  getUnixEpochTicks: () => number;
}

/**
 * Factory function to create a set of functions for building Lumberjack logs with different levels.
 *
 * @example
 * const logFactory = createLumberjackLogFactory({ getUnixEpochTicks: () => Date.now() });
 *
 * const infoLog = logFactory.createInfoLog("Some informational message").build();
 * const debugLog = logFactory.createDebugLog("Some debug message").build();
 */
export function createLumberjackLogFactory<TPayload extends LumberjackLogPayload | void = void>(
  deps: LumberjackLogFactoryDependencies
) {
  /**
   * Create a log builder for a critical log with the specified message.
   */
  function createCriticalLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(LumberjackLevel.Critical, message, deps.getUnixEpochTicks);
  }

  /**
   * Create a log builder for a debug log with the specified message.
   */
  function createDebugLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(LumberjackLevel.Debug, message, deps.getUnixEpochTicks);
  }

  /**
   * Create a log builder for an error log with the specified message.
   */
  function createErrorLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(LumberjackLevel.Error, message, deps.getUnixEpochTicks);
  }

  /**
   * Create a log builder for an info log with the specified message.
   */
  function createInfoLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(LumberjackLevel.Info, message, deps.getUnixEpochTicks);
  }

  /**
   * Create a log builder for a trace log with the specified message.
   */
  function createTraceLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(LumberjackLevel.Trace, message, deps.getUnixEpochTicks);
  }

  /**
   * Create a log builder for a warning log with the specified message.
   */
  function createWarningLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(LumberjackLevel.Warning, message, deps.getUnixEpochTicks);
  }

  return {
    createCriticalLog,
    createDebugLog,
    createErrorLog,
    createInfoLog,
    createTraceLog,
    createWarningLog,
  };
}
