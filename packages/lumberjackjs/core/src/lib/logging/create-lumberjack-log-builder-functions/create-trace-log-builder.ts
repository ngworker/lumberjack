import { LumberjackLevel } from '../../logs/lumberjack-level';
import { LumberjackLogPayload } from '../../logs/lumberjack-log-payload';
import { LumberjackLogBuilder } from '../lumberjack-log.builder';

function createTraceLogBuilderUncarried<TPayload extends LumberjackLogPayload | void = void>(
  getUnixEpochTicks: () => number,
  message: string
): LumberjackLogBuilder<TPayload> {
  return new LumberjackLogBuilder(LumberjackLevel.Trace, message, getUnixEpochTicks);
}

/**
 * Create a log builder for an trace log with the specified message.
 */
export function createTraceLogBuilder<TPayload extends LumberjackLogPayload | void = void>(
  getUnixEpochTicks: () => number
) {
  return (message: string) => createTraceLogBuilderUncarried<TPayload>(getUnixEpochTicks, message);
}
