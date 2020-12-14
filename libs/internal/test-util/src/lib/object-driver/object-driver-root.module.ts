import { NgModule, Optional, SkipSelf } from '@angular/core';

import { lumberjackLogDriverToken } from '@ngworker/lumberjack';

import { ObjectDriver } from './object.driver';

@NgModule({
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useClass: ObjectDriver,
      multi: true,
    },
  ],
})
export class ObjectDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: ObjectDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'ObjectDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
