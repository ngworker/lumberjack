import { NgModule, Optional, SkipSelf } from '@angular/core';

import { LogDriverToken } from '@ngworker/lumberjack';

import { SpyDriver } from './spy.driver';

@NgModule({
  providers: [
    {
      provide: LogDriverToken,
      useClass: SpyDriver,
      multi: true,
    },
  ],
})
export class SpyDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: SpyDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'SpyDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
