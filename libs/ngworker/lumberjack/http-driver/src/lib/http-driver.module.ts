import { ModuleWithProviders, NgModule } from '@angular/core';

import { HttpDriverConfig, HttpDriverConfigToken } from './http-driver-config.token';
import { HttpDriverOptions } from './http-driver-options';
import { HttpDriverRootModule } from './http-driver-root.module';

@NgModule()
export class HttpDriverModule {
  static forRoot(config: HttpDriverConfig): ModuleWithProviders<HttpDriverRootModule> {
    return {
      ngModule: HttpDriverRootModule,
      providers: [
        {
          provide: HttpDriverConfigToken,
          useValue: config,
        },
      ],
    };
  }

  static withOptions(options: HttpDriverOptions): ModuleWithProviders<HttpDriverRootModule> {
    return {
      ngModule: HttpDriverRootModule,
      providers: [
        {
          provide: HttpDriverConfigToken,
          useValue: options,
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import HttpDriverModule directly. Use HttpDriverModule.forRoot.');
  }
}
