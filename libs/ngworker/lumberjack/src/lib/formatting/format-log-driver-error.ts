import { LumberjackLogDriverError } from '../log-drivers/lumberjack-log-driver-error';

// tslint:disable-next-line: no-any
export function formatLogDriverError<TPayload extends Readonly<{ [key: string]: unknown }> | void = void>({
  logDriver,
  formattedLog,
  error,
}: LumberjackLogDriverError<TPayload>): string {
  const thrownErrorMessage = (error as Error).message || String(error);

  return `Could not log message "${formattedLog}" to ${logDriver.constructor.name}.\n Error: "${thrownErrorMessage}"`;
}
