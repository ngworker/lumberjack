import { HttpClient } from '@angular/common/http';
import { Inject, NgModule, NgZone, Optional, SkipSelf } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { LumberjackHttpDriver } from '../log-drivers/lumberjack-http.driver';

import { httpDriverConfigToken } from './http-driver-config.token';
import { HttpDriverConfig } from './http-driver.config';

export function httpDriverFactory(
  http: HttpClient,
  logDriverConfig: LumberjackLogDriverConfig,
  httpDriverConfig: HttpDriverConfig,
  ngZone: NgZone
): LumberjackHttpDriver {
  const config: HttpDriverConfig = {
    ...logDriverConfig,
    ...httpDriverConfig,
  };

  return new LumberjackHttpDriver(http, config, ngZone);
}

@NgModule({
  providers: [
    {
      deps: [HttpClient, lumberjackLogDriverConfigToken, httpDriverConfigToken, NgZone],
      multi: true,
      provide: lumberjackLogDriverToken,
      useFactory: httpDriverFactory,
    },
  ],
})
export class HttpDriverRootModule {
  constructor(
    // tslint:disable: no-any no-null-keyword
    @Optional()
    @SkipSelf()
    @Inject(HttpDriverRootModule)
    maybeNgModuleFromParentInjector: HttpDriverRootModule = null as any
    // tslint:disable: no-any no-null-keyword
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'HttpDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
