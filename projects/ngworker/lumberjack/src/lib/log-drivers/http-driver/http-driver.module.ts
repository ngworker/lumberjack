import { ModuleWithProviders, NgModule } from '@angular/core';

import { defaultLogDriverConfig } from '../../configs/log-driver.config';

import { HttpDriverRootModule } from './http-driver-root.module';
import { HttpDriverConfig, HttpDriverConfigToken } from './http-driver.config';

@NgModule()
export class HttpDriverModule {
  static forRoot(config: HttpDriverConfig): ModuleWithProviders<HttpDriverRootModule> {
    return {
      ngModule: HttpDriverRootModule,
      providers: [
        {
          deps: [LogDriverConfigToken],
          provide: HttpDriverConfigToken,
          useFactory: (logDriverConfig: LogDriverConfig): HttpDriverConfig => ({
            ...logDriverConfig,
            ...config,
          }),
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import HttpDriverModule directly. Use HttpDriverModule.forRoot.');
  }
}
