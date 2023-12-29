import { inject, NgModule } from '@angular/core';

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
  readonly #maybeNgModuleFromParentInjector = inject(SpyDriverRootModule, { optional: true, skipSelf: true });

  constructor() {
    if (this.#maybeNgModuleFromParentInjector) {
      throw new Error(
        'SpyDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}