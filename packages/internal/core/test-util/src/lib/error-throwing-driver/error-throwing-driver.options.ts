import { LumberjackDriverConfig } from '@lumberjackjs/core';

import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';

export type ErrorThrowingDriverOptions = Omit<ErrorThrowingDriverConfig, keyof LumberjackDriverConfig>;
