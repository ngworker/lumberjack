import { LumberjackLogDriverError } from '../log-drivers/lumberjack-log-driver-error';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

/**
 * Create a text representation of the specified log driver error.
 */
export function formatLogDriverError<TPayload extends LumberjackLogPayload | void = void>({
  error,
  formattedLog,
  log,
  logDriver,
}: LumberjackLogDriverError<TPayload>): string {
  const thrownErrorMessage = (error as Error).message ?? String(error);
  const payloadMessage = log.payload ? ` with payload "${JSON.stringify(log.payload)}"` : '';

  return `Could not log message "${formattedLog}"${payloadMessage} to ${logDriver.config.identifier}.\n Error: "${thrownErrorMessage}"`;
}
