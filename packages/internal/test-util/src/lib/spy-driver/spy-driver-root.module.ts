import { NgModule, Optional, SkipSelf } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { spyDriverConfigToken } from './spy-driver-config.token';
import { SpyDriverConfig } from './spy-driver.config';
import { SpyDriver } from './spy.driver';

export function spyDriverFactory(
  logDriverConfig: LumberjackLogDriverConfig,
  spyDriverConfig: SpyDriverConfig
): SpyDriver {
  const baseConfig = { ...logDriverConfig, identifier: SpyDriver.driverIdentifier };
  const fullConfig = { ...baseConfig, ...spyDriverConfig };

  return new SpyDriver(fullConfig);
}

@NgModule({
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useFactory: spyDriverFactory,
      deps: [lumberjackLogDriverConfigToken, spyDriverConfigToken],
      multi: true,
    },
  ],
})
export class SpyDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: SpyDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'SpyDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
