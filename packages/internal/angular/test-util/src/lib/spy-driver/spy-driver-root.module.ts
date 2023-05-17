import { inject, NgModule } from '@angular/core';

import { lumberjackLogDriverToken } from '@ngworker/lumberjack';
import { SpyDriverConfig, spyDriverFactory } from '@internal/core/test-util';

import { spyDriverConfigToken } from './spy-driver-config.token';

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
