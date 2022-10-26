import { inject, InjectFlags, NgModule } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { noopDriverConfigToken } from './noop-driver-config.token';
import { NoopDriverConfig } from './noop-driver.config';
import { NoopDriver } from './noop.driver';

export function combinedNoopDriverConfigFactory(
  logDriverConfig: LumberjackLogDriverConfig,
  noopDriverConfig: NoopDriverConfig
): NoopDriverConfig {
  const baseConfig = { ...logDriverConfig, identifier: NoopDriver.driverIdentifier };
  return { ...baseConfig, ...noopDriverConfig };
}

@NgModule({
  providers: [
    {
      provide: noopDriverConfigToken,
      useFactory: combinedNoopDriverConfigFactory,
      deps: [lumberjackLogDriverConfigToken, noopDriverConfigToken],
    },
    {
      provide: lumberjackLogDriverToken,
      useClass: NoopDriver,
      multi: true,
    },
  ],
})
export class NoopDriverRootModule {
  maybeNgModuleFromParentInjector? = inject(NoopDriverRootModule, InjectFlags.SkipSelf | InjectFlags.Optional);
  constructor() {
    if (this.maybeNgModuleFromParentInjector) {
      throw new Error(
        'NoopDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
