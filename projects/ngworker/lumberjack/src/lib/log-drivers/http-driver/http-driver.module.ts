import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, NgZone } from '@angular/core';

import { LogDriverToken } from '../log-driver';

import { HttpDriverConfig, HttpDriverConfigToken } from './http-driver.config';
import { HttpDriver } from './http.driver';

// factory functions need to extracted and exported for AOT
export function httpDriverFactory(httpClient: HttpClient, config: HttpDriverConfig, ngZone: NgZone): HttpDriver {
  return new HttpDriver(httpClient, config, ngZone);
}

@NgModule({ imports: [HttpClientModule] })
export class HttpDriverModule {
  static forRoot(config: HttpDriverConfig): ModuleWithProviders<HttpDriverModule> {
    return {
      ngModule: HttpDriverModule,
      providers: [
        { provide: HttpDriverConfigToken, useValue: config },
        {
          provide: LogDriverToken,
          useFactory: httpDriverFactory,
          deps: [HttpClient, HttpDriverConfigToken, NgZone],
          multi: true,
        },
      ],
    };
  }
}
