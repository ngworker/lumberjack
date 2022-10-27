import { inject, InjectFlags, NgModule } from '@angular/core';

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
  maybeNgModuleFromParentInjector = inject(ObjectDriverRootModule, InjectFlags.SkipSelf | InjectFlags.Optional);
  constructor() {
    if (this.maybeNgModuleFromParentInjector) {
      throw new Error(
        'ObjectDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
