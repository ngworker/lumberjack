import { NgModule, Optional, SkipSelf } from '@angular/core';

import { ObjectLogDriverToken } from '@ngworker/lumberjack';

import { ObjectSpyDriver } from './object-spy.driver';

@NgModule({
  providers: [
    {
      provide: ObjectLogDriverToken,
      useClass: ObjectSpyDriver,
      multi: true,
    },
  ],
})
export class ObjectSpyDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: ObjectSpyDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'ObjectSpyDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
