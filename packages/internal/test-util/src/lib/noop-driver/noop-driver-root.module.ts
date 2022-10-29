import { inject, InjectFlags, NgModule } from '@angular/core';

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
  private maybeNgModuleFromParentInjector? = inject(NoopDriverRootModule, InjectFlags.SkipSelf | InjectFlags.Optional);

  constructor() {
    if (this.maybeNgModuleFromParentInjector) {
      throw new Error(
        'NoopDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
