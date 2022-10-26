import { inject, NgModule, InjectFlags } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { errorThrowingDriverConfigToken } from './error-throwing-driver-config.token';
import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';
import { ErrorThrowingDriver } from './error-throwing.driver';

export function combinedErrorThrowingDriverConfigFactory(
  logDriverConfig: LumberjackLogDriverConfig,
  errorThrowingDriverConfig: ErrorThrowingDriverConfig
): ErrorThrowingDriverConfig {
  const config: ErrorThrowingDriverConfig = {
    ...logDriverConfig,
    ...errorThrowingDriverConfig,
  };

  return config;
}

@NgModule({
  providers: [
    {
      deps: [lumberjackLogDriverConfigToken, errorThrowingDriverConfigToken],
      provide: errorThrowingDriverConfigToken,
      useFactory: combinedErrorThrowingDriverConfigFactory,
    },
    {
      provide: lumberjackLogDriverToken,
      useClass: ErrorThrowingDriver,
      multi: true,
    },
  ],
})
export class ErrorThrowingDriverRootModule {
  maybeNgModuleFromParentInjector = inject(ErrorThrowingDriverRootModule, InjectFlags.SkipSelf | InjectFlags.Optional);
  constructor() {
    if (this.maybeNgModuleFromParentInjector) {
      throw new Error(
        'ErrorThrowingDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
