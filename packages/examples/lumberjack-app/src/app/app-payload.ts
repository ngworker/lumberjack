import { LumberjackLogPayload } from '@ngworker/lumberjack';

export interface AppPayload extends LumberjackLogPayload {
  readonly angularVersion: string;
}
