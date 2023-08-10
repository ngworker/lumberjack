import { ModuleWithProviders, NgModule } from '@angular/core';

import {
  defaultErrorThrowingDriverConfig,
  defaultErrorThrowingDriverOptions,
  ErrorThrowingDriverConfig,
  ErrorThrowingDriverOptions,
} from '@internal/core/test-util';
import { lumberjackDriverConfigToken } from '@lumberjackjs/angular';
import { LumberjackDriverConfig } from '@lumberjackjs/core';

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
          useFactory: (driverConfig: LumberjackDriverConfig): ErrorThrowingDriverConfig => ({
            ...driverConfig,
            ...fullConfig,
          }),
          deps: [lumberjackDriverConfigToken],
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
          useFactory: (driverConfig: LumberjackDriverConfig): ErrorThrowingDriverConfig => ({
            ...driverConfig,
            ...allOptions,
          }),
          deps: [lumberjackDriverConfigToken],
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import ErrorThrowingDriverModule directly. Use ErrorThrowingDriverModule.forRoot.');
  }
}
