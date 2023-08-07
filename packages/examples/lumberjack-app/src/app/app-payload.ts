import { LumberjackLogPayload } from '@lumberjackjs/core';

export interface AppPayload extends LumberjackLogPayload {
  readonly angularVersion: string;
}
