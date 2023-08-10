import { LumberjackLevel } from '../../logs/lumberjack-level';
import { LumberjackLogPayload } from '../../logs/lumberjack-log-payload';
import { LumberjackLogBuilder } from '../lumberjack-log.builder';

function createCriticalLogBuilderUncarried<TPayload extends LumberjackLogPayload | void = void>(
  getUnixEpochTicks: () => number,
  message: string
): LumberjackLogBuilder<TPayload> {
  return new LumberjackLogBuilder(LumberjackLevel.Critical, message, getUnixEpochTicks);
}

/**
 * Create a log builder for an critical log with the specified message.
 */
export function createCriticalLogBuilder<TPayload extends LumberjackLogPayload | void = void>(
  getUnixEpochTicks: () => number
) {
  return (message: string) => createCriticalLogBuilderUncarried<TPayload>(getUnixEpochTicks, message);
}
