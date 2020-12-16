import { Payload } from '@ngworker/lumberjack';

export interface ObjectPayload extends Payload {
  readonly isWorking: boolean;
}
