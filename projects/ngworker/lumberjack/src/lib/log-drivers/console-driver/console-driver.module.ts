import { ModuleWithProviders, NgModule } from '@angular/core';

import { defaultLogDriverConfig, LogDriverConfig, LogDriverConfigToken } from '../../configs/log-driver.config';
import { LogDriverToken } from '../log-driver';

import { ConsoleDriver } from './console.driver';

@NgModule()
export class ConsoleDriverModule {
  static forRoot(config: LogDriverConfig = defaultLogDriverConfig): ModuleWithProviders<ConsoleDriverModule> {
    return {
      ngModule: ConsoleDriverModule,
      providers: [
        { provide: LogDriverConfigToken, useValue: config },
        {
          provide: LogDriverToken,
          useClass: ConsoleDriver,
          multi: true,
        },
      ],
    };
  }
}
