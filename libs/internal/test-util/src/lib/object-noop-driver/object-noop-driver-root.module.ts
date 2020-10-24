import { NgModule, Optional, SkipSelf } from '@angular/core';

import { ObjectLogDriverToken } from '@ngworker/lumberjack';

import { ObjectNoopDriver } from './object-noop.driver';

@NgModule({
  providers: [
    {
      provide: ObjectLogDriverToken,
      useClass: ObjectNoopDriver,
      multi: true,
    },
  ],
})
export class ObjectNoopDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: ObjectNoopDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'NoopDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
