import { Payload } from '@ngworker/lumberjack';

export interface ObjectPayload extends Payload {
  isWorking: boolean;
}
