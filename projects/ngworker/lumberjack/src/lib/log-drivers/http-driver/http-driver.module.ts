import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';

import { LogDriverConfig, LogDriverConfigToken } from '../../configs/log-driver.config';

import { HttpDriverRootModule } from './http-driver-root.module';
import { HttpDriverConfig, HttpDriverConfigToken } from './http-driver.config';

const PartialLogDriverConfigToken: InjectionToken<LogDriverConfig> = new InjectionToken(
  '__PARTIAL_LOG_DRIVER_CONFIG__'
);

export function httpDriverConfigFactory(logDriverConfig: LogDriverConfig, config: HttpDriverConfig) {
  return {
    ...logDriverConfig,
    ...config,
  };
}

@NgModule()
export class HttpDriverModule {
  static forRoot(config: HttpDriverConfig): ModuleWithProviders<HttpDriverRootModule> {
    return {
      ngModule: HttpDriverRootModule,
      providers: [
        { provide: PartialLogDriverConfigToken, useValue: config },
        {
          deps: [LogDriverConfigToken, PartialLogDriverConfigToken],
          provide: HttpDriverConfigToken,
          useFactory: httpDriverConfigFactory,
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import HttpDriverModule directly. Use HttpDriverModule.forRoot.');
  }
}
