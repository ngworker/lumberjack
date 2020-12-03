import { LumberjackLevel } from '@ngworker/lumberjack';

import { ErrorThrowingDriverConfig } from './error-throwing-driver-config.token';

export const defaultErrorThrowingDriverConfig: ErrorThrowingDriverConfig = {
  levels: [LumberjackLevel.Verbose],
  logsBeforeThrowing: 0,
};
