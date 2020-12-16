import { LumberjackLogPayload } from '@ngworker/lumberjack';

export interface ObjectPayload extends LumberjackLogPayload {
  readonly isWorking: boolean;
}
