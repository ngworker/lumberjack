import { LumberjackLevel } from '@webworker/lumberjack';

import { defaultErrorThrowingDriverOptions } from './default-error-throwing-driver-options';
import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';
import { ErrorThrowingDriver } from './error-throwing.driver';

export const defaultErrorThrowingDriverConfig: ErrorThrowingDriverConfig = {
  ...defaultErrorThrowingDriverOptions,
  levels: [LumberjackLevel.Verbose],
  identifier: ErrorThrowingDriver.driverIdentifier,
};
