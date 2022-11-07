import { ModuleWithProviders, NgModule, Provider } from '@angular/core';

import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

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

/**
 * Returns the [dependency-injection providers](guide/glossary#provider)
 * for the `ErrorThrowingDriver`.
 *
 * @usageNotes
 *
 * The function is useful when you want to bootstrap an application using
 * the `bootstrapApplication` function and want to make available the `ErrorThrowingDriver`.
 *
 * ```typescript
 * bootstrapApplication(RootComponent, {
 *   providers: [
 *    provideLumberjack({...})
 *    provideLumberjackErrorThrowingDriver({...}),
 *   ]
 * });
 * ```
 *
 * @publicApi
 */
export function provideLumberjackErrorThrowingDriver(config: Partial<ErrorThrowingDriverConfig> = {}): Provider[] {
  const fullConfig: ErrorThrowingDriverConfig = {
    ...defaultErrorThrowingDriverConfig,
    ...config,
  };
  return [
    {
      provide: errorThrowingDriverConfigToken,
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): ErrorThrowingDriverConfig => ({
        ...logDriverConfig,
        ...fullConfig,
      }),
      deps: [lumberjackLogDriverConfigToken],
    },
  ];
}

/**
 * Returns the [dependency-injection providers](guide/glossary#provider)
 * for the `ErrorThrowingDriver` using the `ErrorThrowingDriverOptions`.
 *
 * @usageNotes
 *
 * The function is useful when you want to bootstrap an application using
 * the `bootstrapApplication` function and want to make available the `ErrorThrowingDriver`.
 *
 * ```typescript
 * bootstrapApplication(RootComponent, {
 *   providers: [
 *    provideLumberjack({...})
 *    provideLumberjackErrorThrowingDriverWithOptions({...}),
 *   ]
 * });
 * ```
 *
 * @publicApi
 */
export function provideLumberjackErrorThrowingDriverWithOptions(
  options: Partial<ErrorThrowingDriverOptions> = {}
): Provider[] {
  const allOptions: ErrorThrowingDriverOptions = {
    ...defaultErrorThrowingDriverOptions,
    ...options,
  };
  return [
    {
      provide: errorThrowingDriverConfigToken,
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): ErrorThrowingDriverConfig => ({
        ...logDriverConfig,
        ...allOptions,
      }),
      deps: [lumberjackLogDriverConfigToken],
    },
  ];
}
