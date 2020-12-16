import { LumberjackLogDriverError } from '../log-drivers/lumberjack-log-driver-error';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

export function formatLogDriverError<TPayload extends LumberjackLogPayload | void = void>({
  logDriver,
  formattedLog,
  error,
}: LumberjackLogDriverError<TPayload>): string {
  const thrownErrorMessage = (error as Error).message || String(error);

  return `Could not log message "${formattedLog}" to ${logDriver.constructor.name}.\n Error: "${thrownErrorMessage}"`;
}
