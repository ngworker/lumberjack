import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { LumberjackConsole } from '../console/lumberjack-console';
import { lumberjackConsoleToken } from '../console/lumberjack-console.token';
import { LumberjackConsoleDriver } from '../log-drivers/lumberjack-console.driver';

import { lumberjackConsoleDriverConfigToken } from './lumberjack-console-driver-config.token';
import { LumberjackConsoleDriverConfig } from './lumberjack-console-driver.config';

export function consoleDriverFactory(
  logDriverConfig: LumberjackLogDriverConfig,
  consoleDriverConfig: LumberjackConsoleDriverConfig,
  console: LumberjackConsole
): LumberjackConsoleDriver {
  const baseConfig = { ...logDriverConfig, identifier: LumberjackConsoleDriver.driverIdentifier };
  const fullConfig = { ...baseConfig, ...consoleDriverConfig };

  return new LumberjackConsoleDriver(fullConfig, console);
}

/**
 * Do not import directly. Use `LumberjackConsoleDriverModule.forRoot`.
 */
@NgModule({
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useFactory: consoleDriverFactory,
      deps: [lumberjackLogDriverConfigToken, lumberjackConsoleDriverConfigToken, lumberjackConsoleToken],
      multi: true,
    },
  ],
})
export class LumberjackConsoleDriverRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    @Inject(LumberjackConsoleDriverRootModule)
    maybeNgModuleFromParentInjector: LumberjackConsoleDriverRootModule | null | undefined = null
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackConsoleDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
