import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { defaultErrorThrowingDriverConfig } from './default-error-throwing-driver-config';
import { defaultErrorThrowingDriverOptions } from './default-error-throwing-driver-options';
import { errorThrowingDriverConfigToken } from './error-throwing-driver-config.token';
import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';
import { ErrorThrowingDriverOptions } from './error-throwing-driver.options';
import { ErrorThrowingDriver } from './error-throwing.driver';

export type ErrorThrowingDriverConfigurationKind = 'options' | 'config';
export type ErrorThrowingDriverConfiguration<Kind extends ErrorThrowingDriverConfigurationKind> = {
  kind: Kind;
  providers: EnvironmentProviders;
};

export const errorThrowingDriverProvider: Provider = {
  provide: lumberjackLogDriverToken,
  useClass: ErrorThrowingDriver,
  multi: true,
};

function makeLumberjackErrorThrowingConfiguration<Kind extends ErrorThrowingDriverConfigurationKind>(
  kind: Kind,
  providers: Provider[]
): ErrorThrowingDriverConfiguration<Kind> {
  return {
    kind,
    providers: makeEnvironmentProviders(providers),
  };
}

export function withErrorThrowingConfig(
  config: Partial<ErrorThrowingDriverConfig>
): ErrorThrowingDriverConfiguration<'config'> {
  const fullConfig: ErrorThrowingDriverConfig = {
    ...defaultErrorThrowingDriverConfig,
    ...config,
  };

  return makeLumberjackErrorThrowingConfiguration('config', [
    {
      provide: errorThrowingDriverConfigToken,
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): ErrorThrowingDriverConfig => ({
        ...logDriverConfig,
        ...fullConfig,
      }),
      deps: [lumberjackLogDriverConfigToken],
    },
  ]);
}

export function withErrorThrowingOptions(
  options: Partial<ErrorThrowingDriverOptions> = {}
): ErrorThrowingDriverConfiguration<'options'> {
  const allOptions: ErrorThrowingDriverOptions = {
    ...defaultErrorThrowingDriverOptions,
    ...options,
  };
  return makeLumberjackErrorThrowingConfiguration('options', [
    {
      provide: errorThrowingDriverConfigToken,
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): ErrorThrowingDriverConfig => ({
        ...logDriverConfig,
        ...allOptions,
      }),
      deps: [lumberjackLogDriverConfigToken],
    },
  ]);
}

export function provideErrorThrowingDriver<Kind extends ErrorThrowingDriverConfigurationKind>(
  configuration: ErrorThrowingDriverConfiguration<Kind>
): EnvironmentProviders[] {
  return [makeEnvironmentProviders([errorThrowingDriverProvider]), configuration.providers];
}
