import { LumberjackLevel } from '@ngworker/lumberjack';

import { defaultErrorThrowingDriverOptions } from './default-error-throwing-driver-options';
import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';

export const defaultErrorThrowingDriverConfig: ErrorThrowingDriverConfig = {
  ...defaultErrorThrowingDriverOptions,
  levels: [LumberjackLevel.Verbose],
};
