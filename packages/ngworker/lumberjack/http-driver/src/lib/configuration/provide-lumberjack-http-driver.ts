import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';

import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

import { LumberjackHttpDriver } from '../log-drivers/lumberjack-http.driver';

import { lumberjackHttpDriverConfigToken } from './lumberjack-http-driver-config.token';
import { LumberjackHttpDriverInternalConfig } from './lumberjack-http-driver-internal.config';
import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';
import { LumberjackHttpDriverOptions } from './lumberjack-http-driver.options';
import { lumberjackHttpDriverProvider } from './lumberjack-http-driver.provider';

export type LumberjackHttpDriverConfigurationKind = 'options' | 'config';
export type LumberjackHttpDriverConfiguration<Kind extends LumberjackHttpDriverConfigurationKind> = {
  kind: Kind;
  providers: EnvironmentProviders;
};

function makeLumberjackHttpConfiguration<Kind extends LumberjackHttpDriverConfigurationKind>(
  kind: Kind,
  providers: Provider[]
): LumberjackHttpDriverConfiguration<Kind> {
  return {
    kind,
    providers: makeEnvironmentProviders(providers),
  };
}

export function withHttpConfig(config: LumberjackHttpDriverConfig): LumberjackHttpDriverConfiguration<'config'> {
  return makeLumberjackHttpConfiguration('config', [
    {
      provide: lumberjackHttpDriverConfigToken,
      deps: [lumberjackLogDriverConfigToken],
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): LumberjackHttpDriverInternalConfig => ({
        ...logDriverConfig,
        identifier: LumberjackHttpDriver.driverIdentifier,
        ...config,
      }),
    },
  ]);
}

export function withHttpOptions(options: LumberjackHttpDriverOptions): LumberjackHttpDriverConfiguration<'options'> {
  return makeLumberjackHttpConfiguration('options', [
    {
      provide: lumberjackHttpDriverConfigToken,
      deps: [lumberjackLogDriverConfigToken],
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): LumberjackHttpDriverInternalConfig => ({
        ...logDriverConfig,
        identifier: LumberjackHttpDriver.driverIdentifier,
        ...options,
      }),
    },
  ]);
}

/**
 * Returns the [dependency-injection providers](https://angular.io/guide/glossary#provider)
 *
 * for the `LumberjackHttpDriver` and its `LumberjackHttpDriverConfig`.
 * @usageNotes
 *
 * The function is useful when you want to bootstrap an application using
 * the `bootstrapApplication` function and want to make available the `LumberjackHttpDriver` providers.
 *
 * ```typescript
 * bootstrapApplication(RootComponent, {
 *   providers: [
 *    provideLumberjack({...}),
 *    provideLumberjackHttpDriver({...})
 *   ]
 * });
 * ```
 *
 * @publicApi
 */
export function provideLumberjackHttpDriver<Kind extends LumberjackHttpDriverConfigurationKind>(
  configuration: LumberjackHttpDriverConfiguration<Kind>
): EnvironmentProviders[] {
  return [provideHttpClient(), makeEnvironmentProviders([lumberjackHttpDriverProvider]), configuration.providers];
}
