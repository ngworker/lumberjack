import { ModuleWithProviders, NgModule } from '@angular/core';

import { defaultErrorThrowingDriverConfig } from './default-error-throwing-driver-config';
import { defaultErrorThrowingDriverOptions } from './default-error-throwing-driver-options';
import { errorThrowingDriverConfigToken } from './error-throwing-driver-config.token';
import { ErrorThrowingDriverRootModule } from './error-throwing-driver-root.module';
import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';
import { ErrorThrowingDriverOptions } from './error-throwing-driver.options';

/**
 * Service module for `ErrorThrowingDriver`.
 *
 * Use `ErrorThrowingDriverModule.forRoot` to import.
 */
@NgModule()
export class ErrorThrowingDriverModule {
  static forRoot(config: Partial<ErrorThrowingDriverConfig> = {}): ModuleWithProviders<ErrorThrowingDriverRootModule> {
    const fullConfig: ErrorThrowingDriverConfig = {
      ...defaultErrorThrowingDriverConfig,
      ...config,
    };

    return {
      ngModule: ErrorThrowingDriverRootModule,
      providers: [{ provide: errorThrowingDriverConfigToken, useValue: fullConfig }],
    };
  }

  static withOptions(
    options: Partial<ErrorThrowingDriverOptions> = {}
  ): ModuleWithProviders<ErrorThrowingDriverRootModule> {
    const allOptions: ErrorThrowingDriverOptions = {
      ...defaultErrorThrowingDriverOptions,
      ...options,
    };

    return {
      ngModule: ErrorThrowingDriverRootModule,
      providers: [
        {
          provide: errorThrowingDriverConfigToken,
          useValue: allOptions,
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import ErrorThrowingDriverModule directly. Use ErrorThrowingDriverModule.forRoot.');
  }
}
