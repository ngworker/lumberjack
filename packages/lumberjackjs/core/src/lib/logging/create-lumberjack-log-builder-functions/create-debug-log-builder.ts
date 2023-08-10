import { LumberjackLevel } from '../../logs/lumberjack-level';
import { LumberjackLogPayload } from '../../logs/lumberjack-log-payload';
import { LumberjackLogBuilder } from '../lumberjack-log.builder';

function createDebugLogBuilderUncarried<TPayload extends LumberjackLogPayload | void = void>(
  getUnixEpochTicks: () => number,
  message: string
): LumberjackLogBuilder<TPayload> {
  return new LumberjackLogBuilder(LumberjackLevel.Debug, message, getUnixEpochTicks);
}

/**
 * Create a log builder for an debug log with the specified message.
 */
export function createDebugLogBuilder<TPayload extends LumberjackLogPayload | void = void>(
  getUnixEpochTicks: () => number
) {
  return (message: string) => createDebugLogBuilderUncarried<TPayload>(getUnixEpochTicks, message);
}
