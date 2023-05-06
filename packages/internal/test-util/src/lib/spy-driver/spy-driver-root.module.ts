import { inject, NgModule } from '@angular/core';

import { lumberjackLogDriverToken } from '@ngworker/lumberjack';

import { spyDriverConfigToken } from './spy-driver-config.token';
import { SpyDriverConfig } from './spy-driver.config';
import { spyDriverFactory } from './spy.driver-factory';

@NgModule({
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useFactory: (config: SpyDriverConfig) => spyDriverFactory(config),
      multi: true,
      deps: [spyDriverConfigToken],
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
