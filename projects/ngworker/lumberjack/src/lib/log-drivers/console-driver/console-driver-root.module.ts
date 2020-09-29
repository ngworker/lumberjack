import { NgModule, Optional, SkipSelf } from '@angular/core';

import { LogDriverToken } from '../log-driver';

import { ConsoleDriver } from './console.driver';

@NgModule({
  providers: [
    {
      provide: LogDriverToken,
      useClass: ConsoleDriver,
      multi: true,
    },
  ],
})
export class ConsoleDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: ConsoleDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'ConsoleDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
