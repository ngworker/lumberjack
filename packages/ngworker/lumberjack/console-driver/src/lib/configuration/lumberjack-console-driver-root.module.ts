import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';

import { lumberjackLogDriverToken } from '@ngworker/lumberjack';

import { LumberjackConsoleDriver } from '../log-drivers/lumberjack-console.driver';

/**
 * Do not import directly. Use `LumberjackConsoleDriverModule.forRoot`.
 */
@NgModule({
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useClass: LumberjackConsoleDriver,
      multi: true,
    },
  ],
})
export class LumberjackConsoleDriverRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    @Inject(LumberjackConsoleDriverRootModule)
    private readonly maybeNgModuleFromParentInjector: LumberjackConsoleDriverRootModule | null | undefined = null
  ) {
    if (this.maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackConsoleDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
