import { NgModule, Optional, SkipSelf } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { errorThrowingDriverConfigToken } from './error-throwing-driver-config.token';
import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';
import { ErrorThrowingDriver } from './error-throwing.driver';

export function errorThrowingDriverFactory(
  logDriverConfig: LumberjackLogDriverConfig,
  errorThrowingDriverConfig: ErrorThrowingDriverConfig
): ErrorThrowingDriver {
  const config: ErrorThrowingDriverConfig = {
    ...logDriverConfig,
    ...errorThrowingDriverConfig,
  };

  return new ErrorThrowingDriver(config);
}

@NgModule({
  providers: [
    {
      deps: [lumberjackLogDriverConfigToken, errorThrowingDriverConfigToken],
      provide: lumberjackLogDriverToken,
      useFactory: errorThrowingDriverFactory,
      multi: true,
    },
  ],
})
export class ErrorThrowingDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: ErrorThrowingDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'ErrorThrowingDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
