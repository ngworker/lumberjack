import { LumberjackLogPayload } from '@webworker/lumberjack';

export interface AppPayload extends LumberjackLogPayload {
  readonly angularVersion: string;
}
