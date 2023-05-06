import { LumberjackLogPayload } from '@webworker/lumberjack';

export interface ObjectPayload extends LumberjackLogPayload {
  readonly isWorking: boolean;
}
