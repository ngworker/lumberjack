import { LumberjackLevel } from '@ngworker/lumberjack';

import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';
import { ErrorThrowingDriver } from './error-throwing.driver';

export const defaultErrorThrowingDriverConfig: ErrorThrowingDriverConfig = {
  logsBeforeThrowing: 0,
  levels: [LumberjackLevel.Verbose],
  identifier: ErrorThrowingDriver.driverIdentifier,
};
