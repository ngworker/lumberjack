import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';

import { lumberjackLogDriverToken } from '@ngworker/lumberjack';

import { LumberjackConsoleDriver } from '../log-drivers/lumberjack-console.driver';

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
    // tslint:disable: no-any no-null-keyword
    @Optional()
    @SkipSelf()
    @Inject(LumberjackConsoleDriverRootModule)
    maybeNgModuleFromParentInjector: LumberjackConsoleDriverRootModule = null as any
    // tslint:enable: no-any no-null-keyword
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'ConsoleDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
