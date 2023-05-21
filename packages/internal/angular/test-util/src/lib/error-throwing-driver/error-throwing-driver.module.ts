import { ModuleWithProviders, NgModule } from '@angular/core';

import {
  defaultErrorThrowingDriverConfig,
  defaultErrorThrowingDriverOptions,
  ErrorThrowingDriverConfig,
  ErrorThrowingDriverOptions,
} from '@internal/core/test-util';
import { lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';
import { LumberjackLogDriverConfig } from '@webworker/lumberjack';

import { errorThrowingDriverConfigToken } from './error-throwing-driver-config.token';
import { ErrorThrowingDriverRootModule } from './error-throwing-driver-root.module';

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
      providers: [
        {
          provide: errorThrowingDriverConfigToken,
          useFactory: (logDriverConfig: LumberjackLogDriverConfig): ErrorThrowingDriverConfig => ({
            ...logDriverConfig,
            ...fullConfig,
          }),
          deps: [lumberjackLogDriverConfigToken],
        },
      ],
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
          useFactory: (logDriverConfig: LumberjackLogDriverConfig): ErrorThrowingDriverConfig => ({
            ...logDriverConfig,
            ...allOptions,
          }),
          deps: [lumberjackLogDriverConfigToken],
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import ErrorThrowingDriverModule directly. Use ErrorThrowingDriverModule.forRoot.');
  }
}
