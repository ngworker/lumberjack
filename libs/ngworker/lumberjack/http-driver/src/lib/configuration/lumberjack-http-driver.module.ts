import { ModuleWithProviders, NgModule } from '@angular/core';

import { lumberjackHttpDriverConfigToken } from './lumberjack-http-driver-config.token';
import { LumberjackHttpDriverRootModule } from './lumberjack-http-driver-root.module';
import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';
import { LumberjackHttpDriverOptions } from './lumberjack-http-driver.options';

@NgModule()
export class LumberjackHttpDriverModule {
  /**
   * Pass a full HTTP driver configuration.
   */
  static forRoot(config: LumberjackHttpDriverConfig): ModuleWithProviders<LumberjackHttpDriverRootModule> {
    return {
      ngModule: LumberjackHttpDriverRootModule,
      providers: [
        {
          provide: lumberjackHttpDriverConfigToken,
          useValue: config,
        },
      ],
    };
  }

  /**
   * Pass options exclusive to the HTTP driver configuration, but fall back on
   * the log driver config for common options.
   */
  static withOptions(options: LumberjackHttpDriverOptions): ModuleWithProviders<LumberjackHttpDriverRootModule> {
    return {
      ngModule: LumberjackHttpDriverRootModule,
      providers: [
        {
          provide: lumberjackHttpDriverConfigToken,
          useValue: options,
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackHttpDriverModule directly. Use LumberjackHttpDriverModule.forRoot.');
  }
}
