import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Inject, NgModule, NgZone, Optional, SkipSelf } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { LumberjackHttpDriver } from '../log-drivers/lumberjack-http.driver';

import { lumberjackHttpDriverConfigToken } from './lumberjack-http-driver-config.token';
import { LumberjackHttpDriverInternalConfig } from './lumberjack-http-driver-internal.config';

export function httpDriverFactory(
  http: HttpClient,
  logDriverConfig: LumberjackLogDriverConfig,
  httpDriverConfig: LumberjackHttpDriverInternalConfig,
  ngZone: NgZone
): LumberjackHttpDriver {
  const config: LumberjackHttpDriverInternalConfig = {
    ...{ ...logDriverConfig, identifier: LumberjackHttpDriver.driverIdentifier },
    ...httpDriverConfig,
  };

  return new LumberjackHttpDriver(http, config, ngZone);
}

@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      deps: [HttpClient, lumberjackLogDriverConfigToken, lumberjackHttpDriverConfigToken, NgZone],
      multi: true,
      provide: lumberjackLogDriverToken,
      useFactory: httpDriverFactory,
    },
  ],
})
export class LumberjackHttpDriverRootModule {
  constructor(
    // tslint:disable: no-any no-null-keyword
    @Optional()
    @SkipSelf()
    @Inject(LumberjackHttpDriverRootModule)
    maybeNgModuleFromParentInjector: LumberjackHttpDriverRootModule = null as any
    // tslint:enable: no-any no-null-keyword
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackHttpDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
