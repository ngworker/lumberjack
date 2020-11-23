import { LumberjackLogLevel } from '@ngworker/lumberjack';

import { ErrorThrowingDriverConfig } from './error-throwing-driver-config.token';

export const defaultErrorDriverThrowingConfig: ErrorThrowingDriverConfig = {
  logsBeforeThrowing: 0,
  levels: [LumberjackLogLevel.Verbose],
};
