import { LumberjackLogPayload } from '@ngworker/lumberjack';

export interface LogPayload extends LumberjackLogPayload {
  angularVersion: string;
}
