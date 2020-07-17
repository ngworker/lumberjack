import { HttpClient } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpDriverConfig, HttpDriverConfigToken } from './http-driver.config';
import { HttpDriver } from './http.driver';
import { LogDriverToken } from '../log-driver';

// factory functions need to extracted and exported for AOT
export function httpDriverFactory(httpClient: HttpClient, config: HttpDriverConfig): HttpDriver {
  return new HttpDriver(httpClient, config);
}

@NgModule()
export class HttpDriverModule {
  static forRoot(config: HttpDriverConfig): ModuleWithProviders<HttpDriverModule> {
    return {
      ngModule: HttpDriverModule,
      providers: [
        { provide: HttpDriverConfigToken, useValue: config },
        {
          provide: LogDriverToken,
          useFactory: httpDriverFactory,
          deps: [HttpClient, HttpDriverConfigToken],
          multi: true,
        },
      ],
    };
  }
}
