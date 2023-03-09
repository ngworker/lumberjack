import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';

import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

import { LumberjackHttpDriver } from '../log-drivers/lumberjack-http.driver';

import { lumberjackHttpDriverConfigToken } from './lumberjack-http-driver-config.token';
import { LumberjackHttpDriverInternalConfig } from './lumberjack-http-driver-internal.config';
import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';
import { LumberjackHttpDriverOptions } from './lumberjack-http-driver.options';
import { lumberjackHttpDriverProvider } from './lumberjack-http-driver.provider';

export type LumberjackHttpDriverConfigurationKind = 'options' | 'config';
export type LumberjackHttpDriverConfiguration<Kind extends LumberjackHttpDriverConfigurationKind> = {
  ɵkind: Kind;
  ɵproviders: Provider[];
};

function makeLumberjackHttpConfiguration<Kind extends LumberjackHttpDriverConfigurationKind>(
  kind: Kind,
  providers: Provider[]
): LumberjackHttpDriverConfiguration<Kind> {
  return {
    ɵkind: kind,
    ɵproviders: providers,
  };
}

export function withConfig(config: LumberjackHttpDriverConfig): LumberjackHttpDriverConfiguration<'config'> {
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

export function withOptions(options: LumberjackHttpDriverOptions): LumberjackHttpDriverConfiguration<'options'> {
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
): (Provider | EnvironmentProviders)[] {
  return [provideHttpClient(), lumberjackHttpDriverProvider, configuration.ɵproviders];
}
