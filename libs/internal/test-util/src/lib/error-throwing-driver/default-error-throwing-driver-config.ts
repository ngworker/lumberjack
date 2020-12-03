import { LumberjackLevel } from '@ngworker/lumberjack';

import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';

export const defaultErrorThrowingDriverConfig: ErrorThrowingDriverConfig = {
  levels: [LumberjackLevel.Verbose],
  logsBeforeThrowing: 0,
};
