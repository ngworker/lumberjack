import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';

import { defaultLogDriverConfig, LogDriverConfigToken } from './configs/log-driver.config';

@NgModule({
  providers: [
    {
      provide: LogDriverConfigToken,
      useValue: defaultLogDriverConfig,
    },
  ],
})
export class LumberjackRootModule {
  constructor(
    @Optional() @SkipSelf() @Inject(LumberjackRootModule) maybeNgModuleFromParentInjector?: LumberjackRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
