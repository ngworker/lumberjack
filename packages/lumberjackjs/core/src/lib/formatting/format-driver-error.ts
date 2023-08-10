import { LumberjackDriverError } from '../drivers/lumberjack-driver-error';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

/**
 * Create a text representation of the specified driver error.
 */
export function formatDriverError<TPayload extends LumberjackLogPayload | void = void>({
  error,
  formattedLog,
  log,
  driver,
}: LumberjackDriverError<TPayload>): string {
  const thrownErrorMessage = (error as Error).message ?? String(error);
  const payloadMessage = log.payload ? ` with payload "${JSON.stringify(log.payload)}"` : '';

  return `Could not log message "${formattedLog}"${payloadMessage} to ${driver.config.identifier}.\n Error: "${thrownErrorMessage}"`;
}
