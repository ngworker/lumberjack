import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Inject, NgModule, NgZone, Optional, SkipSelf } from '@angular/core';

import { LogDriverConfig, LogDriverConfigToken, LogDriverToken } from '@ngworker/lumberjack';

import { HttpDriverConfig, HttpDriverConfigToken } from './http-driver.config';
import { HttpDriver } from './http.driver';

export function httpDriverFactory(
  http: HttpClient,
  logDriverConfig: LogDriverConfig,
  httpDriverConfig: HttpDriverConfig,
  ngZone: NgZone
): HttpDriver {
  const config: HttpDriverConfig = {
    ...logDriverConfig,
    ...httpDriverConfig,
  };

  return new HttpDriver(http, config, ngZone);
}

@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      deps: [HttpClient, LogDriverConfigToken, HttpDriverConfigToken, NgZone],
      multi: true,
      provide: LogDriverToken,
      useFactory: httpDriverFactory,
    },
  ],
})
export class HttpDriverRootModule {
  constructor(
    @Optional() @SkipSelf() @Inject(HttpDriverRootModule) maybeNgModuleFromParentInjector?: HttpDriverRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'HttpDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
