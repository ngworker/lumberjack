import { LumberjackLevel } from '@lumberjackjs/core';

import { errorThrowingDriverIdentifier } from './create-error-throwing-driver';
import { defaultErrorThrowingDriverOptions } from './default-error-throwing-driver-options';
import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';

export const defaultErrorThrowingDriverConfig: ErrorThrowingDriverConfig = {
  ...defaultErrorThrowingDriverOptions,
  levels: [LumberjackLevel.Verbose],
  identifier: errorThrowingDriverIdentifier,
};
