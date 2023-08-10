import { LumberjackLevel } from '../../logs/lumberjack-level';
import { LumberjackLogPayload } from '../../logs/lumberjack-log-payload';
import { LumberjackLogBuilder } from '../lumberjack-log.builder';

function createWarningLogBuilderUncarried<TPayload extends LumberjackLogPayload | void = void>(
  getUnixEpochTicks: () => number,
  message: string
): LumberjackLogBuilder<TPayload> {
  return new LumberjackLogBuilder(LumberjackLevel.Warning, message, getUnixEpochTicks);
}

/**
 * Create a log builder for an warning log with the specified message.
 */
export function createWarningLogBuilder<TPayload extends LumberjackLogPayload | void = void>(
  getUnixEpochTicks: () => number
) {
  return (message: string) => createWarningLogBuilderUncarried<TPayload>(getUnixEpochTicks, message);
}
