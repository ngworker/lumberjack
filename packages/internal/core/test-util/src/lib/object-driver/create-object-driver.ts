import { LumberjackLogDriver, LumberjackLogDriverLog } from '@webworker/lumberjack';

import { ObjectDriverConfig } from './object-driver.config';
import { ObjectLogger } from './object-logger';
import { ObjectPayload } from './object.payload';

export const objectDriverIdentifier = 'ObjectDriver';

export type ObjectDriver = Omit<LumberjackLogDriver<ObjectPayload>, 'config'> & { config: ObjectDriverConfig };

export function createObjectDriver(config: ObjectDriverConfig, objectLogger: ObjectLogger): ObjectDriver {
  function logCritical({ log }: LumberjackLogDriverLog<ObjectPayload>): void {
    objectLogger.log(log.payload);
  }

  function logDebug({ log }: LumberjackLogDriverLog<ObjectPayload>): void {
    objectLogger.log(log.payload);
  }

  function logError({ log }: LumberjackLogDriverLog<ObjectPayload>): void {
    objectLogger.log(log.payload);
  }

  function logInfo({ log }: LumberjackLogDriverLog<ObjectPayload>): void {
    objectLogger.log(log.payload);
  }

  function logTrace({ log }: LumberjackLogDriverLog<ObjectPayload>): void {
    objectLogger.log(log.payload);
  }

  function logWarning({ log }: LumberjackLogDriverLog<ObjectPayload>): void {
    objectLogger.log(log.payload);
  }

  return {
    config,
    logCritical,
    logDebug,
    logError,
    logInfo,
    logTrace,
    logWarning,
  };
}
