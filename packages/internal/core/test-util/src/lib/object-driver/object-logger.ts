import { ObjectPayload } from './object.payload';

export type ObjectLogger = ReturnType<typeof createObjectLogger>;

export function createObjectLogger() {
  function log(object?: ObjectPayload): boolean {
    return object?.isWorking || false;
  }

  return {
    log,
  };
}
