import { LumberjackLogDriverError } from '../log-drivers/lumberjack-log-driver-error';

// tslint:disable-next-line: no-any
export function formatLogDriverError<F extends Record<string, any> | undefined = undefined>({
  logDriver,
  formattedLog,
  error,
}: LumberjackLogDriverError<F>): string {
  const thrownErrorMessage = (error as Error).message || String(error);

  return `Could not log message "${formattedLog}" to ${logDriver.constructor.name}.\n Error: "${thrownErrorMessage}"`;
}
