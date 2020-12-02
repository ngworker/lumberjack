import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { HttpDriverConfig } from './http-driver.config';
export type HttpDriverOptions = Omit<HttpDriverConfig, keyof LumberjackLogDriverConfig>;
