import { inject, NgModule } from '@angular/core';

import { createNoopDriver, NoopDriverConfig } from '@internal/core/test-util';
import { lumberjackLogDriverToken } from '@lumberjackjs/angular';

import { noopDriverConfigToken } from './noop-driver-config.token';

@NgModule({
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useFactory: (config: NoopDriverConfig) => createNoopDriver(config),
      multi: true,
      deps: [noopDriverConfigToken],
    },
  ],
})
export class NoopDriverRootModule {
  readonly #maybeNgModuleFromParentInjector = inject(NoopDriverRootModule, { optional: true, skipSelf: true });

  constructor() {
    if (this.#maybeNgModuleFromParentInjector) {
      throw new Error(
        'NoopDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
