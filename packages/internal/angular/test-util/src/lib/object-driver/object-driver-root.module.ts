import { inject, NgModule } from '@angular/core';

import { createObjectDriver, ObjectDriverConfig, ObjectLogger } from '@internal/core/test-util';
import { lumberjackLogDriverToken } from '@ngworker/lumberjack';

import { objectDriverConfigToken } from './object-driver-config.token';
import { ObjectService } from './object.service';

@NgModule({
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useFactory: (config: ObjectDriverConfig, objectService: ObjectLogger) =>
        createObjectDriver(config, objectService),
      multi: true,
      deps: [objectDriverConfigToken, ObjectService],
    },
  ],
})
export class ObjectDriverRootModule {
  readonly #maybeNgModuleFromParentInjector = inject(ObjectDriverRootModule, { optional: true, skipSelf: true });

  constructor() {
    if (this.#maybeNgModuleFromParentInjector) {
      throw new Error(
        'ObjectDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
