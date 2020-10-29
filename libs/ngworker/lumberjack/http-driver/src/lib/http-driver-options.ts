import { ExcludeFromType, LogDriverConfig } from '@ngworker/lumberjack';

import { HttpDriverConfig } from './http-driver-config.token';

export type HttpDriverOptions = ExcludeFromType<HttpDriverConfig, LogDriverConfig>;
