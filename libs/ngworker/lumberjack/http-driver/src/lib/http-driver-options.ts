import { LogDriverConfig } from '@ngworker/lumberjack';

import { HttpDriverConfig } from './http-driver-config.token';

export type HttpDriverOptions = Omit<HttpDriverConfig, keyof LogDriverConfig>;
