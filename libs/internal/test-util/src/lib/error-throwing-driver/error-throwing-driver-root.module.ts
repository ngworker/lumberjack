import { NgModule, Optional, SkipSelf } from '@angular/core';

import { LogDriverConfig, logDriverConfigToken, lumberjackLogDriverToken } from '@ngworker/lumberjack';

import { ErrorThrowingDriverConfig, errorThrowingDriverConfigToken } from './error-throwing-driver-config.token';
import { ErrorThrowingDriver } from './error-throwing.driver';

export function errorThrowingDriverFactory(
  logDriverConfig: LogDriverConfig,
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
      deps: [logDriverConfigToken, errorThrowingDriverConfigToken],
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
