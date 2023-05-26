import { inject, NgModule } from '@angular/core';

import { lumberjackLogDriverToken } from '@ngworker/lumberjack';

import { ObjectDriver } from './object.driver';

@NgModule({
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useClass: ObjectDriver,
      multi: true,
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
