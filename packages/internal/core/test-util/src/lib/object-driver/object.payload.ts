import { LumberjackLogPayload } from '@lumberjackjs/core';

export interface ObjectPayload extends LumberjackLogPayload {
  readonly isWorking: boolean;
}
