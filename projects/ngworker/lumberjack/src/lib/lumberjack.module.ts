import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { defaultLogConfig } from './configs/default-log.config';
import { LumberjackLogConfig, LumberjackLogConfigToken } from './configs/lumberjack-log.config';
import { LogDriverConfigToken, defaultLogDriverConfig } from './configs/log-driver.config';

@NgModule({
  imports: [CommonModule],
})
export class NgLoggerModule {
  static forRoot(config: LumberjackLogConfig = defaultLogConfig): ModuleWithProviders<NgLoggerModule> {
    return {
      ngModule: NgLoggerModule,
      providers: [
        {
          provide: LumberjackLogConfigToken,
          useValue: config,
        },
        {
          provide: LogDriverConfigToken,
          useValue: defaultLogDriverConfig,
        },
      ],
    };
  }
}
