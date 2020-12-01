import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';

import { logDriverToken } from '@ngworker/lumberjack';

import { ConsoleDriver } from '../log-drivers/console.driver';

@NgModule({
  providers: [
    {
      provide: logDriverToken,
      useClass: ConsoleDriver,
      multi: true,
    },
  ],
})
export class ConsoleDriverRootModule {
  constructor(
    // tslint:disable: no-any no-null-keyword
    @Optional()
    @SkipSelf()
    @Inject(ConsoleDriverRootModule)
    maybeNgModuleFromParentInjector: ConsoleDriverRootModule = null as any
    // tslint:enable: no-any no-null-keyword
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'ConsoleDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
