import { inject, NgModule } from '@angular/core';

import { lumberjackLogDriverToken } from '@ngworker/lumberjack';

import { NoopDriver } from './noop.driver';

@NgModule({
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useClass: NoopDriver,
      multi: true,
    },
  ],
})
export class NoopDriverRootModule {
  private readonly maybeNgModuleFromParentInjector = inject(NoopDriverRootModule, { optional: true, skipSelf: true });

  constructor() {
    if (this.maybeNgModuleFromParentInjector) {
      throw new Error(
        'NoopDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
