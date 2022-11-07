import { ModuleWithProviders, NgModule } from '@angular/core';

import { isProductionEnvironmentToken } from '../environment/is-production-environment.token';

import { lumberjackConfigToken } from './lumberjack-config.token';
import { lumberjackLogDriverConfigToken } from './lumberjack-log-driver-config.token';
import { lumberjackOptionsToken } from './lumberjack-options.token';
import { LumberjackRootModule } from './lumberjack-root.module';
import { LumberjackOptions } from './lumberjack.options';
import { configFactory, logDriverConfigFactory } from './lumberjack.providers';

/**
 * The Lumberjack Angular module is used to register necessary Lumberjack
 * services and configure shared settings.
 *
 * NOTE! Do not import `LumberjackModule` directly. Use
 * `LumberjackModule.forRoot`.
 */
@NgModule()
export class LumberjackModule {
  /**
   * Register necessary Lumberjack services and configure shared settings.
   *
   * @param options Settings shared throughout Lumberjack services and log
   *   drivers.
   */
  static forRoot(options?: LumberjackOptions): ModuleWithProviders<LumberjackRootModule> {
    return {
      ngModule: LumberjackRootModule,
      providers: [
        { provide: lumberjackOptionsToken, useValue: options },
        {
          deps: [isProductionEnvironmentToken],
          provide: lumberjackConfigToken,
          useFactory: (isProductionEnvironment: boolean) => configFactory(isProductionEnvironment, options),
        },
        {
          deps: [lumberjackConfigToken],
          provide: lumberjackLogDriverConfigToken,
          useFactory: logDriverConfigFactory,
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackModule directly. Use LumberjackModule.forRoot.');
  }
}
