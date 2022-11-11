import { inject, InjectFlags, NgModule } from '@angular/core';

import { lumberjackLogDriverToken } from '@ngworker/lumberjack';

import { SpyDriver } from './spy.driver';

@NgModule({
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useClass: SpyDriver,
      multi: true,
    },
  ],
})
export class SpyDriverRootModule {
  private readonly maybeNgModuleFromParentInjector = inject(
    SpyDriverRootModule,
    InjectFlags.Optional | InjectFlags.SkipSelf
  );

  constructor() {
    if (this.maybeNgModuleFromParentInjector) {
      throw new Error(
        'SpyDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
