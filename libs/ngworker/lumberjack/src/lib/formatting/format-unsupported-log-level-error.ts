import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';

export function formatUnsupportedLogLevelError<TPayload extends LumberjackLogPayload | void = void>(
  log: LumberjackLog<TPayload>,
  formattedLog: string
): string {
  const payloadMessage = log.payload ? ` with payload "${JSON.stringify(log.payload)}"` : '';

  return `Unsupported log level "${log.level}" for log message "${formattedLog}"${payloadMessage}.`;
}
