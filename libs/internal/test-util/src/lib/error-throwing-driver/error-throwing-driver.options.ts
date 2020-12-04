import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';

export type ErrorThrowingDriverOptions = Omit<ErrorThrowingDriverConfig, keyof LumberjackLogDriverConfig>;
