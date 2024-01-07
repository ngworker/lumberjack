import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackHttpDriverRootModule } from './lumberjack-http-driver-root.module';
import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';
import { LumberjackHttpDriverOptions } from './lumberjack-http-driver.options';
import {
  HttpClientFeatures,
  provideLumberjackHttpDriver,
  withHttpConfig,
  withHttpOptions,
} from './provide-lumberjack-http-driver';

/**
 * The HTTP driver Angular module is used to configure and register the HTTP
 * driver.
 *
 * NOTE! Do not import `LumberjackHttpDriverModule` directly. Use
 * `LumberjackHttpDriverModule.forRoot` or
 * `LumberjackHttpDriverModule.withOptions`.
 *
 * @deprecated Use standalone provider function `provideLumberjackHttpDriver` instead. NgModules will be removed in Lumberjack 18.
 *
 */
@NgModule()
export class LumberjackHttpDriverModule {
  /**
   * Configure and register the HTTP driver, including settings that log drivers
   * have in common.
   *
   * @param config Settings used by the HTTP driver.
   */
  static forRoot(
    config: LumberjackHttpDriverConfig,
    ...features: HttpClientFeatures
  ): ModuleWithProviders<LumberjackHttpDriverRootModule> {
    return {
      ngModule: LumberjackHttpDriverRootModule,
      providers: [provideLumberjackHttpDriver(withHttpConfig(config), ...features)],
    };
  }

  /**
   * Configure and register the HTTP driver, but fall back on the default log
   * driver settings for settings that log drivers have in common.
   * @param options Settings used by the HTTP driver.
   */
  static withOptions(
    options: LumberjackHttpDriverOptions,
    ...features: HttpClientFeatures
  ): ModuleWithProviders<LumberjackHttpDriverRootModule> {
    return {
      ngModule: LumberjackHttpDriverRootModule,
      providers: [provideLumberjackHttpDriver(withHttpOptions(options), ...features)],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackHttpDriverModule directly. Use LumberjackHttpDriverModule.forRoot.');
  }
}
