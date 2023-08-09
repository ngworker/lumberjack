import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';

import { lumberjackLogDriverConfigToken } from '@lumberjackjs/angular';
import { LumberjackLogDriverConfig } from '@lumberjackjs/core';

import { LumberjackAngularHttpDriver } from '../log-drivers/lumberjack-angular-http.driver';

import { LumberjackAngularHttpDriverConfigToken } from './lumberjack-angular-http-driver-config.token';
import { LumberjackAngularHttpDriverInternalConfig } from './lumberjack-angular-http-driver-internal.config';
import { LumberjackAngularHttpDriverConfig } from './lumberjack-angular-http-driver.config';
import { LumberjackAngularHttpDriverOptions } from './lumberjack-angular-http-driver.options';
import { LumberjackAngularHttpDriverProvider } from './lumberjack-angular-http-driver.provider';

export type LumberjackAngularHttpDriverConfigurationKind = 'options' | 'config';
export type LumberjackAngularHttpDriverConfiguration<Kind extends LumberjackAngularHttpDriverConfigurationKind> = {
  kind: Kind;
  providers: EnvironmentProviders;
};

function makeLumberjackHttpConfiguration<Kind extends LumberjackAngularHttpDriverConfigurationKind>(
  kind: Kind,
  providers: Provider[]
): LumberjackAngularHttpDriverConfiguration<Kind> {
  return {
    kind,
    providers: makeEnvironmentProviders(providers),
  };
}

export function withHttpConfig(
  config: LumberjackAngularHttpDriverConfig
): LumberjackAngularHttpDriverConfiguration<'config'> {
  return makeLumberjackHttpConfiguration('config', [
    {
      provide: LumberjackAngularHttpDriverConfigToken,
      deps: [lumberjackLogDriverConfigToken],
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): LumberjackAngularHttpDriverInternalConfig => ({
        ...logDriverConfig,
        identifier: LumberjackAngularHttpDriver.driverIdentifier,
        ...config,
      }),
    },
  ]);
}

export function withHttpOptions(
  options: LumberjackAngularHttpDriverOptions
): LumberjackAngularHttpDriverConfiguration<'options'> {
  return makeLumberjackHttpConfiguration('options', [
    {
      provide: LumberjackAngularHttpDriverConfigToken,
      deps: [lumberjackLogDriverConfigToken],
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): LumberjackAngularHttpDriverInternalConfig => ({
        ...logDriverConfig,
        identifier: LumberjackAngularHttpDriver.driverIdentifier,
        ...options,
      }),
    },
  ]);
}

export type HttpClientFeatures = Parameters<typeof provideHttpClient>;

/**
 * Returns the [dependency-injection providers](https://angular.io/guide/glossary#provider)
 *
 * for the `LumberjackAngularHttpDriver` and its `LumberjackAngularHttpDriverConfig`.
 * @usageNotes
 *
 * The function is useful when you want to bootstrap an application using
 * the `bootstrapApplication` function and want to make available the `LumberjackAngularHttpDriver` providers.
 *
 * ```typescript
 * bootstrapApplication(RootComponent, {
 *   providers: [
 *    provideLumberjack({...}),
 *    provideLumberjackAngularHttpDriver({...})
 *   ]
 * });
 * ```
 *
 * @publicApi
 */
export function provideLumberjackAngularHttpDriver<Kind extends LumberjackAngularHttpDriverConfigurationKind>(
  configuration: LumberjackAngularHttpDriverConfiguration<Kind>,
  ...features: HttpClientFeatures
): EnvironmentProviders[] {
  return [
    provideHttpClient(...features),
    makeEnvironmentProviders([LumberjackAngularHttpDriverProvider]),
    configuration.providers,
  ];
}
