import { NgModule, Optional, SkipSelf } from '@angular/core';

import { StringLogDriverToken } from '@ngworker/lumberjack';

import { StringNoopDriver } from './string-noop.driver';

@NgModule({
  providers: [
    {
      provide: StringLogDriverToken,
      useClass: StringNoopDriver,
      multi: true,
    },
  ],
})
export class StringNoopDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: StringNoopDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'StringNoopDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
