import { NgModule, Optional, SkipSelf } from '@angular/core';

import { LogDriverToken } from '@ngworker/lumberjack';

import { ErrorThrowingDriver } from './error-throwing.driver';

@NgModule({
  providers: [
    {
      provide: LogDriverToken,
      useClass: ErrorThrowingDriver,
      multi: true,
    },
  ],
})
export class ErrorThrowingDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: ErrorThrowingDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'ErrorThrowingDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
