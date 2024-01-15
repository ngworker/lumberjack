import { Provider } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { spyDriverConfigToken } from './spy-driver-config.token';
import { SpyDriverConfig } from './spy-driver.config';
import { SpyDriver } from './spy.driver';

export function provideSpyDriver(config: Partial<SpyDriverConfig> = {}): Provider[] {
  return [
    {
      provide: spyDriverConfigToken,
      deps: [lumberjackLogDriverConfigToken],
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): SpyDriverConfig => ({
        ...logDriverConfig,
        identifier: SpyDriver.driverIdentifier,
        ...config,
      }),
    },
    {
      provide: lumberjackLogDriverToken,
      useClass: SpyDriver,
      multi: true,
    },
  ];
}
