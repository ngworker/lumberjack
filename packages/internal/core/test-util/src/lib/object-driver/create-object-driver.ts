import { LumberjackDriver, LumberjackDriverLog } from '@lumberjackjs/core';

import { ObjectDriverConfig } from './object-driver.config';
import { ObjectLogger } from './object-logger';
import { ObjectPayload } from './object.payload';

export const objectDriverIdentifier = 'ObjectDriver';

export type ObjectDriver = Omit<LumberjackDriver<ObjectPayload>, 'config'> & { config: ObjectDriverConfig };

export function createObjectDriver(config: ObjectDriverConfig, objectLogger: ObjectLogger): ObjectDriver {
  function logCritical({ log }: LumberjackDriverLog<ObjectPayload>): void {
    objectLogger.log(log.payload);
  }

  function logDebug({ log }: LumberjackDriverLog<ObjectPayload>): void {
    objectLogger.log(log.payload);
  }

  function logError({ log }: LumberjackDriverLog<ObjectPayload>): void {
    objectLogger.log(log.payload);
  }

  function logInfo({ log }: LumberjackDriverLog<ObjectPayload>): void {
    objectLogger.log(log.payload);
  }

  function logTrace({ log }: LumberjackDriverLog<ObjectPayload>): void {
    objectLogger.log(log.payload);
  }

  function logWarning({ log }: LumberjackDriverLog<ObjectPayload>): void {
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
