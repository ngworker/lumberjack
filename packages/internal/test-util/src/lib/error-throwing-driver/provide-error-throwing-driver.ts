import { Provider } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { defaultErrorThrowingDriverConfig } from './default-error-throwing-driver-config';
import { errorThrowingDriverConfigToken } from './error-throwing-driver-config.token';
import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';
import { ErrorThrowingDriver } from './error-throwing.driver';

export const errorThrowingDriverProvider: Provider = {
  provide: lumberjackLogDriverToken,
  useClass: ErrorThrowingDriver,
  multi: true,
};

export function provideErrorThrowingDriver(config: Partial<ErrorThrowingDriverConfig> = {}): Provider[] {
  const fullConfig: ErrorThrowingDriverConfig = {
    ...defaultErrorThrowingDriverConfig,
    ...config,
  };
  return [
    {
      provide: errorThrowingDriverConfigToken,
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): ErrorThrowingDriverConfig => ({
        ...logDriverConfig,
        ...fullConfig,
      }),
      deps: [lumberjackLogDriverConfigToken],
    },
    errorThrowingDriverProvider
  ];
}
