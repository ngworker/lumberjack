import { Provider } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { noopDriverConfigToken } from './noop-driver-config.token';
import { NoopDriverConfig } from './noop-driver.config';
import { NoopDriver } from './noop.driver';

export function provideNoopDriver(config: Partial<NoopDriverConfig> = {}): Provider[] {
  return [
    {
      provide: noopDriverConfigToken,
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): NoopDriverConfig => ({
        ...logDriverConfig,
        identifier: NoopDriver.driverIdentifier,
        ...config,
      }),
      deps: [lumberjackLogDriverConfigToken],
    },
    {
      provide: lumberjackLogDriverToken,
      useClass: NoopDriver,
      multi: true,
    },
  ];
}
