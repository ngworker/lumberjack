import { NgModule, Optional, SkipSelf } from '@angular/core';

import { StringLogDriverToken } from '@ngworker/lumberjack';

import { StringSpyDriver } from './string-spy.driver';

@NgModule({
  providers: [
    {
      provide: StringLogDriverToken,
      useClass: StringSpyDriver,
      multi: true,
    },
  ],
})
export class StringSpyDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: StringSpyDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'StringSpyDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
