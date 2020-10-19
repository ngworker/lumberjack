import { NgModule, Optional, SkipSelf } from '@angular/core';

import { defaultLogDriverConfig, LogDriverConfigToken, LogDriverToken } from '@ngworker/lumberjack';

import { NoopDriver } from './noop-driver.service';

@NgModule({
  providers: [
    {
      provide: LogDriverConfigToken,
      useValue: defaultLogDriverConfig,
    },
    {
      provide: LogDriverToken,
      useClass: NoopDriver,
      multi: true,
    },
  ],
})
export class NoopDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: NoopDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'ConsoleDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
