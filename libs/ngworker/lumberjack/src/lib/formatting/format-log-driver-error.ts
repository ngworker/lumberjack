import { LumberjackLogDriverError } from '../log-drivers/lumberjack-log-driver-error';

export function formatLogDriverError({ logDriver, formattedLog, error }: LumberjackLogDriverError): string {
  const thrownErrorMessage = (error as Error).message || String(error);

  return `Could not log message "${formattedLog}" to ${logDriver.constructor.name}.\n Error: "${thrownErrorMessage}"`;
}
