import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

import { LumberjackHttpDriver } from '../log-drivers/lumberjack-http.driver';

import { lumberjackHttpDriverConfigToken } from './lumberjack-http-driver-config.token';
import { LumberjackHttpDriverInternalConfig } from './lumberjack-http-driver-internal.config';
import { LumberjackHttpDriverRootModule } from './lumberjack-http-driver-root.module';
import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';
import { LumberjackHttpDriverOptions } from './lumberjack-http-driver.options';
import { HTTP_PROVIDER } from './lumberjack-http-driver.providers';

/**
 * The HTTP driver Angular module is used to configure and register the HTTP
 * driver.
 *
 * NOTE! Do not import `LumberjackHttpDriverModule` directly. Use
 * `LumberjackHttpDriverModule.forRoot` or
 * `LumberjackHttpDriverModule.withOptions`.
 */
@NgModule()
export class LumberjackHttpDriverModule {
  /**
   * Configure and register the HTTP driver, including settings that log drivers
   * have in common.
   *
   * @param config Settings used by the HTTP driver.
   */
  static forRoot(config: LumberjackHttpDriverConfig): ModuleWithProviders<LumberjackHttpDriverRootModule> {
    return {
      ngModule: LumberjackHttpDriverRootModule,
      providers: [
        HTTP_PROVIDER,
        {
          provide: lumberjackHttpDriverConfigToken,
          deps: [lumberjackLogDriverConfigToken],
          useFactory: (logDriverConfig: LumberjackLogDriverConfig): LumberjackHttpDriverInternalConfig => ({
            ...logDriverConfig,
            identifier: LumberjackHttpDriver.driverIdentifier,
            ...config,
          }),
        },
      ],
    };
  }

  /**
   * Configure and register the HTTP driver, but fall back on the default log
   * driver settings for settings that log drivers have in common.
   * @param options Settings used by the HTTP driver.
   */
  static withOptions(options: LumberjackHttpDriverOptions): ModuleWithProviders<LumberjackHttpDriverRootModule> {
    return {
      ngModule: LumberjackHttpDriverRootModule,
      providers: [
        HTTP_PROVIDER,
        {
          provide: lumberjackHttpDriverConfigToken,
          deps: [lumberjackLogDriverConfigToken],
          useFactory: (logDriverConfig: LumberjackLogDriverConfig): LumberjackHttpDriverInternalConfig => ({
            ...logDriverConfig,
            identifier: LumberjackHttpDriver.driverIdentifier,
            ...options,
          }),
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackHttpDriverModule directly. Use LumberjackHttpDriverModule.forRoot.');
  }
}
