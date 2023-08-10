import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackAngularHttpDriverRootModule } from './lumberjack-angular-http-driver-root.module';
import { LumberjackAngularHttpDriverConfig } from './lumberjack-angular-http-driver.config';
import { LumberjackAngularHttpDriverOptions } from './lumberjack-angular-http-driver.options';
import {
  HttpClientFeatures,
  provideLumberjackAngularHttpDriver,
  withHttpConfig,
  withHttpOptions,
} from './provide-lumberjack-angular-http-driver';

/**
 * The HTTP driver Angular module is used to configure and register the HTTP
 * driver.
 *
 * NOTE! Do not import `LumberjackAngularHttpDriverModule` directly. Use
 * `LumberjackAngularHttpDriverModule.forRoot` or
 * `LumberjackAngularHttpDriverModule.withOptions`.
 */
@NgModule()
export class LumberjackAngularHttpDriverModule {
  /**
   * Configure and register the HTTP driver, including settings that drivers
   * have in common.
   *
   * @param config Settings used by the HTTP driver.
   */
  static forRoot(
    config: LumberjackAngularHttpDriverConfig,
    ...features: HttpClientFeatures
  ): ModuleWithProviders<LumberjackAngularHttpDriverRootModule> {
    return {
      ngModule: LumberjackAngularHttpDriverRootModule,
      providers: [provideLumberjackAngularHttpDriver(withHttpConfig(config), ...features)],
    };
  }

  /**
   * Configure and register the HTTP driver, but fall back on the default log
   * driver settings for settings that drivers have in common.
   * @param options Settings used by the HTTP driver.
   */
  static withOptions(
    options: LumberjackAngularHttpDriverOptions,
    ...features: HttpClientFeatures
  ): ModuleWithProviders<LumberjackAngularHttpDriverRootModule> {
    return {
      ngModule: LumberjackAngularHttpDriverRootModule,
      providers: [provideLumberjackAngularHttpDriver(withHttpOptions(options), ...features)],
    };
  }

  constructor() {
    throw new Error(
      'Do not import LumberjackAngularHttpDriverModule directly. Use LumberjackAngularHttpDriverModule.forRoot.'
    );
  }
}
