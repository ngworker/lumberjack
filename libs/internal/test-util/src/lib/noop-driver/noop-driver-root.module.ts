import { NgModule, Optional, SkipSelf } from '@angular/core';

import { logDriverToken } from '@ngworker/lumberjack';

import { NoopDriver } from './noop.driver';

@NgModule({
  providers: [
    {
      provide: logDriverToken,
      useClass: NoopDriver,
      multi: true,
    },
  ],
})
export class NoopDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: NoopDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'NoopDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
