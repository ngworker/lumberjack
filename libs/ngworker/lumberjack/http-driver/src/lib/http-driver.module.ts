import { ModuleWithProviders, NgModule } from '@angular/core';

import { HttpDriverConfig, httpDriverConfigToken } from './http-driver-config.token';
import { HttpDriverOptions } from './http-driver-options';
import { HttpDriverRootModule } from './http-driver-root.module';

@NgModule()
export class HttpDriverModule {
  /**
   * Pass a full HTTP driver configuration.
   */
  static forRoot(config: HttpDriverConfig): ModuleWithProviders<HttpDriverRootModule> {
    return {
      ngModule: HttpDriverRootModule,
      providers: [
        {
          provide: httpDriverConfigToken,
          useValue: config,
        },
      ],
    };
  }

  /**
   * Pass options exclusive to the HTTP driver configuration, but fall back on
   * the log driver config for common options.
   */
  static withOptions(options: HttpDriverOptions): ModuleWithProviders<HttpDriverRootModule> {
    return {
      ngModule: HttpDriverRootModule,
      providers: [
        {
          provide: httpDriverConfigToken,
          useValue: options,
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import HttpDriverModule directly. Use HttpDriverModule.forRoot.');
  }
}
