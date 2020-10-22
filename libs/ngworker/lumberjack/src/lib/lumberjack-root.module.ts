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
    // tslint:disable: no-any no-null-keyword
    @Optional()
    @SkipSelf()
    @Inject(LumberjackRootModule)
    maybeNgModuleFromParentInjector: LumberjackRootModule = null as any
    // tslint:enable: no-any no-null-keyword
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
