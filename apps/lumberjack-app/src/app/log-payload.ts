import { Payload } from '@ngworker/lumberjack';

export interface LogPayload extends Payload {
  angularVersion: string;
}
