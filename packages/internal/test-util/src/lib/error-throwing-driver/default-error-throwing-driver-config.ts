import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';
import { ErrorThrowingDriver } from './error-throwing.driver';

export const defaultErrorThrowingDriverConfig: ErrorThrowingDriverConfig = {
  logsBeforeThrowing: 0,
  levels: ['verbose'],
  identifier: ErrorThrowingDriver.driverIdentifier,
};
