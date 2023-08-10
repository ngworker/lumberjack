import { LumberjackLevel } from '../../logs/lumberjack-level';
import { LumberjackLogPayload } from '../../logs/lumberjack-log-payload';
import { LumberjackLogBuilder } from '../lumberjack-log.builder';

function createErrorLogBuilderUncarried<TPayload extends LumberjackLogPayload | void = void>(
  getUnixEpochTicks: () => number,
  message: string
): LumberjackLogBuilder<TPayload> {
  return new LumberjackLogBuilder(LumberjackLevel.Error, message, getUnixEpochTicks);
}

/**
 * Create a log builder for an error log with the specified message.
 */
export function createErrorLogBuilder<TPayload extends LumberjackLogPayload | void = void>(
  getUnixEpochTicks: () => number
) {
  return (message: string) => createErrorLogBuilderUncarried<TPayload>(getUnixEpochTicks, message);
}
