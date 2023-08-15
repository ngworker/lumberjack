import { ObjectPayload } from './object.payload';

export type ObjectLogger = {
  log: (object?: ObjectPayload) => boolean;
};

export function createObjectLogger(): ObjectLogger {
  function log(object?: ObjectPayload): boolean {
    return object?.isWorking ?? false;
  }

  return {
    log,
  };
}
